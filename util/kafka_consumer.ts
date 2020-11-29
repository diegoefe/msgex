import { Config } from '../src/config';
import { PingMsg } from '../src/msgproc';

import { KafkaClient, Consumer, Message, HighLevelProducer } from 'kafka-node';
const cfg:Config = new Config('./config.yaml');

const client:KafkaClient = new KafkaClient(cfg.kafka.url);

client.once('connect', function () {
  client.loadMetadataForTopics([], function (error, results) {
    if (error) {
      return console.error(error);
    }
    console.log(JSON.stringify(results));
  });
});

client.on('error', function(error) {
    console.error(error);
});

var options = {
    // autoCommit: true,
    autoCommit: false,
    fetchMaxWaitMs: 1000,
    fetchMaxBytes: 1024 * 1024
  };

  //console.log(cfg.kafka)
  var consumer = new Consumer(client, [
      { topic:cfg.kafka.topics.outbound.success },
      { topic:cfg.kafka.topics.outbound.error },
      { topic:cfg.kafka.topics.outbound.dead },
      { topic:cfg.kafka.topics.inbound }
    ],
    options
  );
  
  consumer.on('message', function(message:Message) {
    console.log('received message in topic "'+message.topic+'"')
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