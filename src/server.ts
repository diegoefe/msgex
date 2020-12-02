import express, { Application, Request, Response, NextFunction } from 'express';
import bodyParser from "body-parser";
import { Config } from '../src/config';
import * as fs from 'fs';
import { MsgProc, PingMsg, EndMsg } from './msgproc';
import { Producer, Consumer, iTopicMsg } from './kfk';
import { Server } from 'http';

const createConfig = () => {
    const cfile:string = './config.yaml';
    if(fs.existsSync(cfile)) {
        console.log('Using config file "'+cfile+'"');
        return new Config(cfile);
    }
    return new Config();
}

const cfg:Config = createConfig();
const producer:Producer = new Producer(cfg.kafka.url);
const consumer:Consumer = new Consumer(cfg.kafka.url, [ { topic:cfg.topics.inbound } ], true);
const msgProc:MsgProc = new MsgProc(cfg, producer);

const app:Application = express();
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req:Request, res:Response, nex:NextFunction) => {
    res.send('Sample messaging server, it\'s '+new Date());
})

app.put('/message', (req:Request, res:Response) => {
    console.log("Got incoming message", req.body);
    const payload = req.body.payload;
    const msg:PingMsg = 'transaction-id' in req.body ?
                            new PingMsg(payload.force_error, req.body['transaction-id']) :
                            new PingMsg(payload.force_error);
    // enqueue the message (TODO)
    msgProc.consume(msg);
    // console.log('PingMsg', msg)
    
    // echo the created PingMsg
    res.send(msg);
})

const server = app.listen(cfg.server.port, async ()=> {
    process.stdout.write('Server running on port '+cfg.server.port+'\n')
    process.stdout.write('Current configuration is\n'+JSON.stringify(cfg, null, 2)+'\n')
    try {
        await producer.connect();
        process.stdout.write('producer connected to kafka\n')
        process.stdout.write('consumer connected and listening for messages\n')
        while(true) {
            const mit:iTopicMsg = await consumer.receive();
            console.log('received message', mit.topic, mit.msg);
            if(mit.msg.payload.message === 'end') {
                console.log('stopping consummer')
                break;
            }
            msgProc.consume(mit.msg);
        }
        console.log('Waiting for consumer to stop...');
        await consumer.close();
        console.log('terminating server')
        server.close();
        console.log('server closed')
        process.exit();
        console.log('this should not be seen')
    } catch(e) {
        // TODO: better error resolution here
        console.log('error', e)
    }

});

process.on('SIGINT', async ()=>{
    console.log('SIGINT detected sending EndMsg');
    await producer.send(cfg.topics.inbound, new EndMsg());
})
