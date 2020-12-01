import { KafkaClient, Consumer as KConsumer, Message, HighLevelProducer } from 'kafka-node';
// import { Config } from './config';
import { Msg, ErrMsg, iProducer } from './msgproc';

class Cli {
    protected cli?:KafkaClient;
    protected async makeClient(_host:any) : Promise<KafkaClient> {
        let cli:KafkaClient = new KafkaClient(_host);
        return new Promise((resolve, reject)=>{
            cli.on('error', (err:string)=>reject(err));
            cli.on('ready', ()=>resolve(cli));
        })
    }
}

export class Producer extends Cli implements iProducer {
    private prod_?:HighLevelProducer;
    async connect(_host:string) {
        this.cli = await super.makeClient(_host);
        this.prod_ = new HighLevelProducer(this.cli);
    }
    async send(_topic:string, _msg:Msg) : Promise<string> {
        const payload = [{
            topic: _topic,
            messages: JSON.stringify(_msg, null, 2),
            attributes: 1 /* Use GZip compression for the payload */
        }];

        if(this.prod_) {
            const prod:HighLevelProducer=this.prod_;
            return new Promise<string>((resolve,reject) => {
            //Send payload to Kafka and log result/error
                prod.send(payload, function(error, result) {
                    // console.info('Sent payload to Kafka: ', payload);
                    if (error) {
                        reject(error);
                    } else {
                        // var formattedResult = result[0];
                        // console.log('result: ', result)
                        resolve(result);
                    }
                });
                prod.on('error', (error) => {
                    console.error(error);
                    reject(error);
                });
            });
        }
        return new Promise<string>((res,rej) => { rej('error'); })
    }
}

export interface iTopicMsg {
    topic:string;
    msg:Msg;
}

export class Consumer extends Cli {
    private cons_?:KConsumer;
    async connect(_host:string, _topics:any) {
        this.cli = await super.makeClient(_host);
        var options = {
            autoCommit: true,
            // autoCommit: false,
            fetchMaxWaitMs: 1000,
            fetchMaxBytes: 1024 * 1024
          };
        this.cons_ = new KConsumer(this.cli, _topics, options);
    }

    async receive() : Promise<iTopicMsg> {
        if(this.cons_) {
            const cons:KConsumer = this.cons_;
            return new Promise((resolve,reject)=> {
                cons.on('message', function(message:Message) {
                    // console.log('received message in topic "'+message.topic+'"')
                    const msg:Msg = JSON.parse(message.value.toString());
                    // console.log(msg);
                    resolve({msg:msg, topic:message.topic})
                  });
                  
                  cons.on('error', function(err) {
                    reject(new Error(err));
                  });
            })
        }
        return { topic:'none', msg:new ErrMsg('bad Consumer') }
    }
    async close() {
        if(this.cons_) {
            const cons:KConsumer = this.cons_;
            return new Promise((resolve,reject)=> {
                cons.close(true, function() {
                    resolve(true);
                });
            });
        }
    }
}
