import { expect } from 'chai';
import 'mocha';

import { Msg, PingMsg, PongMsg, ErrMsg, MsgProc, iProducer } from '../src/msgproc';
import sinon, { stubInterface,  stubConstructor } from "ts-sinon";
import { Config } from '../src/config';
import { resolve } from 'path';


class MockProd implements iProducer {
  topic:string;
  msg:Msg;
  
  constructor() {
    this.topic='';
    this.msg = new ErrMsg('');
  }

  send(_topic:string, _msg:Msg) {
    this.topic = _topic;
    this.msg = _msg;
    return new Promise<string>((resolve, reject)=>{
      resolve("ok")
    })
  }
}

describe('Message processing', 
() => { 
  it('Msg creation', () => { 
      const ping = new PingMsg(false);
      expect(ping.payload).to.eql({ message:"ping", force_error:false });
      const time:number=10000;
      const pong = new PongMsg(time);
      expect(pong.payload).to.eql({ message:"pong", processing_time:time });
  });
  
  describe('MsgProc', 
  () => { 
    it('instantiation', () => {
      let dummyProc = stubConstructor(MockProd);
      let cfg:Config = new Config('./sample-config.yaml');
      cfg.server.messages.processing_delay = 10;
      cfg.server.messages.processing_delay = 4;
      let mp:MsgProc = new MsgProc(cfg, dummyProc);
      expect(mp.delay).to.eql(cfg.server.messages.processing_delay);      
      expect(mp.failure_limit).to.eql(cfg.server.messages.failure_limit);      
    });
  });

});
