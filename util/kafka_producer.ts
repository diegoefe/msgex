import { Config } from '../src/config';
import { PingMsg } from '../src/msgproc';
import { Producer } from '../src/kfk';

const cfg:Config = new Config('./config.yaml');

(async () => {
  try {
      let prod:Producer = new Producer();
      console.log('Connecting to '+cfg.kafka.url+'...');
      await prod.connect(cfg.kafka.url);
      console.log('Sending....');
      await prod.send(cfg.topics.inbound, new PingMsg(false));
      // the first time we create the topic entry for these three
      // await prod.send(cfg.topics.outbound.success, new PingMsg(false));
      // await prod.send(cfg.topics.outbound.error, new PingMsg(false));
      // await prod.send(cfg.topics.outbound.dead, new PingMsg(false));
      console.log('done')
      process.exit(0);
  } catch (e) {
      console.log("Error", e)
      process.exit(1);
  }
})();
