import { KafkaClient, Consumer as KConsumer, Message, HighLevelProducer } from 'kafka-node';
// import { Config } from './config';
import { Msg, iProducer } from './msgproc';

class Cli {
    protected cli:KafkaClient;
    constructor(_host:any) {
        this.cli = new KafkaClient(_host);
    }
}

export class Producer extends Cli implements iProducer {
    private prod_:HighLevelProducer;
    constructor(_host:any) {
        super(_host);
        this.cli = new KafkaClient(_host);
        this.prod_ = new HighLevelProducer(this.cli);
    }
    async connect() {
        return new Promise((resolve, reject)=>{
            this.prod_.on('error', (err:string)=>reject(new Error("Producer connect error:"+err)));
            this.prod_.on('ready', ()=>resolve("connected"));
        });
    }
    async send(_topic:string, _msg:Msg) : Promise<string> {
        const payload = [{
            topic: _topic,
            messages: JSON.stringify(_msg, null, 2),
            attributes: 1 /* Use GZip compression for the payload */
        }];
        return new Promise<string>((resolve,reject) => {
            //Send payload to Kafka and log result/error
            this.prod_.send(payload, function(error, result) {
                // console.info('Sent payload to Kafka: ', payload);
                if (error) {
                    reject(new Error("Producer send error:"+error));
                } else {
                    // var formattedResult = result[0];
                    // console.log('result: ', result)
                    resolve(result);
                }
            });
        });
    }
}

export interface iTopicMsg {
    topic:string;
    msg:Msg;
}

export class Consumer extends Cli {
    private cons_:KConsumer;
    constructor(_host:any, _topics:any, _auto_commit:boolean) {
        super(_host);
        this.cli = new KafkaClient(_host);
        var options = {
            autoCommit: _auto_commit,
            fetchMaxWaitMs: 1000,
            fetchMaxBytes: 1024 * 1024
        };
        this.cons_ = new KConsumer(this.cli, _topics, options);
        this.cons_.once('error', (err:string)=> { throw new Error("Consumer connect error:"+err)});
    }
    async receive() : Promise<iTopicMsg> {
        return new Promise((resolve,reject)=> {
            this.cons_.once('message', function(message:Message) {
            // console.log('received message in topic "'+message.topic+'"')
            try {
                const msg:Msg = JSON.parse(message.value.toString());
                // console.log("receiving msg", message.value, msg);
                resolve({msg:msg, topic:message.topic})
            } catch (e:any) {
                reject(new Error(e));
            }
            });
        })
    }
    async close() {
        return new Promise((resolve,reject)=> {
            this.cons_.close(true, function() {
                resolve(true);
            });
        });
    }
}
