import { Config } from '../src/config';
import { PingMsg } from '../src/msgproc';

import { KafkaClient as Client, HighLevelProducer } from 'kafka-node';

const cfg:Config = new Config('./config.yaml');
const client = new Client(cfg.kafka.url);
client.on('error', function(error) {
    console.error(error);
});

var producer = new HighLevelProducer(client);

producer.on('ready', function() {
  const msg = new PingMsg(false);
  var payload = [{
    topic: cfg.kafka.topics.inbound,
    // topic: cfg.kafka.topics.outbound.dead,
    messages: JSON.stringify(msg, null, 2),
    attributes: 1 /* Use GZip compression for the payload */
  }];

  //Send payload to Kafka and log result/error
  producer.send(payload, function(error, result) {
    console.info('Sent payload to Kafka: ', payload);
    if (error) {
      console.error(error);
    } else {
      var formattedResult = result[0];
      console.log('result: ', result)
      process.exit(0);
    }
  });
});

// For this demo we just log producer errors to the console.
producer.on('error', function(error) {
  console.error(error);
  process.exit(1);
});
