import { KafkaClient, Consumer, Message, HighLevelProducer } from 'kafka-node';
// import { Config } from './config';
import { Msg } from './msgproc';

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

export class Producer extends Cli {
    private prod_?:HighLevelProducer;
    async connect(_host:string) {
        this.cli = await super.makeClient(_host);
        this.prod_ = new HighLevelProducer(this.cli);
    }
    async send(_topic:string, _msg:Msg) {
        const payload = [{
            topic: _topic,
            messages: JSON.stringify(_msg, null, 2),
            attributes: 1 /* Use GZip compression for the payload */
        }];

        if(this.prod_) {
            const prod:HighLevelProducer=this.prod_;
            return new Promise((resolve,reject) => {
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
    }
}