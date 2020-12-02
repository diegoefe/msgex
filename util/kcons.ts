import { Config } from '../src/config';
import { Consumer, iTopicMsg } from '../src/kfk';

const cfg:Config = new Config('./config.yaml');

(async () => {
  try {
      let stopped=false;
      let cons:Consumer = new Consumer(cfg.kafka.url,
        [
                { topic:cfg.topics.outbound.success },
                { topic:cfg.topics.outbound.error },
                { topic:cfg.topics.outbound.dead },
                { topic:cfg.topics.inbound }
        ]
      );
      // process.on('SIGINT', async function() {
      //     stopped=true;
      //     console.log('interrupted, aborting!')
      // });
      console.log('Connecting to '+cfg.kafka.url+'...');
      console.log("Waiting for messages");
      // this is buggy beacause it will block until the next message to shut down
      while(! stopped) {
        const mit:iTopicMsg = await cons.receive();
        console.log('received message', mit.topic, mit.msg);
      }
      await cons.close();
      process.exit(0);
  } catch (e) {
      console.log("Error", e)
      process.exit(1);
  }
})();
