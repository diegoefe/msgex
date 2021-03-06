import { expect } from 'chai';
import 'mocha';
import { Config } from '../src/config';
import tcfg from './testconfig';

describe('Config', 
  () => {
    it('load from file', () => {
      const cfg:Config = new Config('./sample-config.yaml');
      expect(cfg.server).to.eql(tcfg.server)
      expect(cfg.messages).to.eql(tcfg.messages)
      expect(cfg.topics).to.eql(tcfg.topics)
      expect(cfg.kafka).to.eql(tcfg.kafka)
    });
    it('load from environment', function() {
      if(! process.env.ME_KAFKA_URL) {
         this.skip();
      }
      const cfg:Config = new Config();
      expect(cfg.server).to.eql(tcfg.server)
      expect(cfg.messages).to.eql(tcfg.messages)
      expect(cfg.topics).to.eql(tcfg.topics)
      expect(cfg.kafka).to.eql(tcfg.kafka)
    }); 
});
