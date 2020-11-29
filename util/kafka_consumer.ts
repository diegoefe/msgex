import { Config } from '../src/config';
import { PingMsg } from '../src/msgproc';

import { KafkaClient as Client, Consumer, Message, KafkaClient } from 'kafka-node';
const cfg:Config = new Config('./config.yaml');

const client:KafkaClient = new Client(cfg.kafka.url);

client.on('error', function(error) {
    console.error(error);
});

var options = {
    // autoCommit: true,
    fetchMaxWaitMs: 1000,
    fetchMaxBytes: 1024 * 1024
  };

    console.log(cfg.kafka)
  var consumer = new Consumer(client, [ { topic:cfg.kafka.topics.inbound } ], options);
  
  consumer.on('message', function(message:Message) {
    const msg:PingMsg = JSON.parse(message.value.toString());
    console.log(msg);
  });
  
  consumer.on('error', function(err) {
    console.log('error', err);
  });
  
  process.on('SIGINT', function() {
    consumer.close(true, function() {
      process.exit(0);
    });
  });