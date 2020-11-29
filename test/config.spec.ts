import { expect } from 'chai';
import 'mocha';
import { Config } from '../src/config';
import tcfg from './testconfig';

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
