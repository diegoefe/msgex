import { Command } from 'commander';

const cli = new Command()
cli
   .usage('[options]')
   .option('-e, --error', 'Force error message', false)
   .option('-t, --transaction-id <s>', 'Set transaction-id', '')
   .parse(process.argv);

if(cli.h) { process.exit(0) }

import { Config } from '../src/config';
import { PingMsg } from '../src/msgproc';
import { Producer } from '../src/kfk';
import { v4 as uuidv4 } from 'uuid';

const cfg:Config = new Config('./config.yaml');

(async () => {
    try {
        let prod:Producer = new Producer(cfg.kafka.url);
        console.log('Connecting to '+cfg.kafka.url+'...');
        await prod.connect();
        //console.log('cli.transactionId', cli.transactionId)
        const ping:PingMsg = new PingMsg(cli.error, cli.transactionId || uuidv4());
        console.log('Sending....', ping);
        await prod.send(cfg.topics.inbound, ping);
        console.log('done')
        process.exit(0);
    } catch (e) {
        console.log("Error", e)
        process.exit(1);
    }
  })();