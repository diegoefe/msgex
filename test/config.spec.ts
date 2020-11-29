import { expect } from 'chai';
import 'mocha';
import { Config } from '../src/config';

const tcfg = {
  server: {
    topics: {
      inbound: 'myinboundtopic',
      outbound: {
        error: "myoutbounderrortopic",
        success: "myoutboundsuccesstopic"
      }
    },
    messages: { processing_time: 30, failure_limit: 3 }
  },
  kafka: { url: 'localhost:2181' }
}

describe('Config', 
  () => { 
    it('load from file', () => { 
      const cfg:Config = new Config('./sample-config.yaml');
      expect(cfg.server).to.eql(tcfg.server)
      expect(cfg.kafka).to.eql(tcfg.kafka)
    }); 
    it('load from environment', () => { 
      const cfg:Config = new Config();
      expect(cfg.server).to.eql(tcfg.server)
      expect(cfg.kafka).to.eql(tcfg.kafka)
    }); 
});
