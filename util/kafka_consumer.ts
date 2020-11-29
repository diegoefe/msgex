import { Config } from '../src/config';
import { PingMsg } from '../src/msgproc';
import { Consumer, MsgInTopic } from '../src/kfk';

const cfg:Config = new Config('./config.yaml');

(async () => {
  try {
      let stopped=false;
      let cons:Consumer = new Consumer();
      process.on('SIGINT', async function() {
          stopped=true;
          console.log('interrupted, aborting!')
      });      
      console.log('Connecting to '+cfg.kafka.url+'...');
      await cons.connect(cfg.kafka.url,
        [
                { topic:cfg.kafka.topics.outbound.success },
                { topic:cfg.kafka.topics.outbound.error },
                { topic:cfg.kafka.topics.outbound.dead },
                { topic:cfg.kafka.topics.inbound }
        ]
      );
      console.log("Waiting for messages");
      // this is buggy beacause it will block until the next message to shut down
      while(! stopped) {
        const mit:MsgInTopic = await cons.receive();
        console.log('received message in topic "'+mit.topic+'"', mit.msg);
      }
      await cons.close();
      process.exit(0);
  } catch (e) {
      console.log("Error", e)
      process.exit(1);
  }
})();
