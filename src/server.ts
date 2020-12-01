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

const createConfig = () => {
    const cfile:string = './config.yaml';
    if(fs.existsSync(cfile)) {
        console.log('Using config file "'+cfile+'"');
        return new Config(cfile);
    }
    return new Config();
}

const cfg:Config = createConfig();

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
    // console.log('PingMsg', msg)

    // echo the created PingMsg
    res.send(msg);
})

app.listen(cfg.server.port, ()=> {
    process.stdout.write('Server running on port '+cfg.server.port+'\n')
    process.stdout.write('Current configuration is\n'+JSON.stringify(cfg, null, 2)+'\n')
});
