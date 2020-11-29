import express from 'express';
import { Config } from '../src/config';
import * as fs from 'fs';

let cfg:Config = new Config();;

if(fs.existsSync('./config.yaml')) {
    cfg = new Config('./config.yaml');
}

const app = express();

app.get('/', (req,res) => {
    res.send('Hola loco');
})

app.listen(cfg.server.port, ()=> {
    console.log('Server running on port '+cfg.server.port)
});