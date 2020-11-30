import { expect } from 'chai';
import 'mocha';

import { Msg, PingMsg, PongMsg, ErrMsg, MsgProc, iProducer } from '../src/msgproc';
import sinon, { stubInterface,  stubConstructor } from "ts-sinon";
import { Config } from '../src/config';
import { resolve } from 'path';


class MockProd implements iProducer {
  topic:string = '';
  msg:Msg = new ErrMsg('');

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
      let now= ping.payload.created_at;
      expect(ping.payload).to.eql({ message:"ping", force_error:false, created_at:now });
      const time:number=10000;
      const pong = new PongMsg(time, ping.transaction_id);
      expect(pong.payload).to.eql({ message:"pong", processing_time:time });
      expect(pong.transaction_id).to.eql(ping.transaction_id)
      const custom_tid:string = "my-custom-transaction-id";
      const ping2 = new PingMsg(true, custom_tid);
      now= ping2.payload.created_at;
      expect(ping2.payload).to.eql({ message:"ping", force_error:true, created_at:now });
      expect(ping2.transaction_id).to.eql(custom_tid)
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
