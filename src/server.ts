import express, {
    Application,
    Request,
    Response,
    NextFunction
} from 'express';
import { Config } from '../src/config';
import * as fs from 'fs';

let cfg:Config = new Config();;

if(fs.existsSync('./config.yaml')) {
    cfg = new Config('./config.yaml');
}

const app:Application = express();

app.get('/', (req:Request, res:Response, nex:NextFunction) => {
    res.send('Sample messaging server, it\'s '+new Date());
})

// get current status of message
app.get('/message/:msgId', (req:Request, res:Response) => {

})

// enqueue a new message
app.put('/message', (req:Request, res:Response) => {
    
})

app.listen(cfg.server.port, ()=> {
    process.stdout.write('Server running on port '+cfg.server.port+'\n')
    process.stdout.write('Current configuration is\n'+JSON.stringify(cfg, null, 2)+'\n')
});
