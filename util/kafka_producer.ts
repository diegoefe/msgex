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
      await prod.send(cfg.kafka.topics.inbound, new PingMsg(false));
      console.log('done')
      process.exit(0);
  } catch (e) {
      console.log("Error", e)
      process.exit(1);
  }
})();
