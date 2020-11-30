import express, {
    Application,
    Request,
    Response,
    NextFunction
} from 'express';
import bodyParser from "body-parser";
import { Config } from '../src/config';
import * as fs from 'fs';
import { PingMsg, PongMsg } from './msgproc';

let cfg:Config = new Config();;

if(fs.existsSync('./config.yaml')) {
    cfg = new Config('./config.yaml');
}

const app:Application = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req:Request, res:Response, nex:NextFunction) => {
    res.send('Sample messaging server, it\'s '+new Date());
})

app.put('/message', (req:Request, res:Response) => {
    console.log("Got incoming message", req.body);
    const msg:PingMsg = new PingMsg(req.body.force_error);
    // enqueue the message
    res.send(msg);
})

app.listen(cfg.server.port, ()=> {
    process.stdout.write('Server running on port '+cfg.server.port+'\n')
    process.stdout.write('Current configuration is\n'+JSON.stringify(cfg, null, 2)+'\n')
});
