import { expect } from 'chai';
import 'mocha';

import { Msg, PingMsg, PongMsg, MsgProc, iProducer, LooseObject } from '../src/msgproc';
import { stubConstructor } from "ts-sinon";
import { Config } from '../src/config';
import { v4 as uuidv4 } from 'uuid';


class MockMsg extends Msg {
  constructor(_desc:string) {
      super("mock", {"description":_desc}, uuidv4());
  }
}

class MockProd implements iProducer {
  topic:string = '';
  msg:Msg = new MockMsg('');

  send(_topic:string, _msg:Msg) {
    // console.log("MockProd.send", _topic, _msg)
    this.topic = _topic;
    this.msg = _msg;
    return new Promise<string>((resolve, reject)=>{
      resolve("ok")
    })
  }
}

const  delay= (secs: number) => {
  return new Promise( resolve => setTimeout(resolve, secs*1000) );
}

describe('Message processing', 
() => { 
  describe('Msg', () => { 
    it('creation', () => { 
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

    it('cloning', () => { 
      const ping:PingMsg = new PingMsg(false);
      expect(ping).to.eql(ping.clone());
      const pong:PongMsg = new PongMsg(new Date().getTime(), "dummy-id");
      expect(pong).to.eql(pong.clone());
    });

    it/*.only*/('json convertions', () => {
      const time:number=2000;
      const id:string="some id"
      const p:PongMsg = new PongMsg(time, id);
      const js:string = `{
        "transaction-id": "${id}",
        "payload": {
          "message":"pong",
          "processing_time": ${time}
        }
      }`
      expect(Msg.fromJSON(JSON.parse(js))).to.eql(p);
    });

  });
  
  describe('MsgProc', () => { 
    it('instantiation', () => {
      let dummyProc = stubConstructor(MockProd);
      let cfg:Config = new Config('./sample-config.yaml');
      cfg.messages.processing_delay = 10;
      cfg.messages.failure_limit = 4;
      let mp:MsgProc = new MsgProc(cfg, dummyProc);
      expect(mp.delay).to.eql(cfg.messages.processing_delay);
      expect(mp.failure_limit).to.eql(cfg.messages.failure_limit);
    });
    describe('processing', () => { 
      // setup
      let prod:MockProd = new MockProd();
      let cfg:Config = new Config('./sample-config.yaml');
      const pt:number=2;
      cfg.messages.processing_delay = pt;
      cfg.messages.failure_limit = 2;
      
      it('happy path', async function() {
        this.timeout(0); // disable time-out
        let mp:MsgProc = new MsgProc(cfg, prod);
        const id1:string = "transaction-1";
        const m1:PingMsg = new PingMsg(false, id1);
        mp.consume(m1);
        await delay(pt);
        expect(prod.topic).to.eql(cfg.topics.outbound.success);
        let p1:PongMsg = new PongMsg(pt, id1);
        expect(prod.msg).to.eql(p1);
        // same successufull message should not be processed
        mp.consume(m1);
        expect(prod.topic).to.eql(cfg.topics.outbound.success);
        let rp1:PongMsg = p1.clone();
        rp1.payload.processing_time = 0;
        expect(prod.msg).to.eql(rp1);
      });

      it/*.only*/('error/retrying', async function() {
        this.timeout(0); // disable time-out
        let mp:MsgProc = new MsgProc(cfg, prod);
        const id1:string = "transaction-2";
        const m1:PingMsg = new PingMsg(true, id1);
        mp.consume(m1);
        await delay(pt);
        expect(prod.topic).to.eql(cfg.topics.outbound.error);
        let p1:PongMsg = new PongMsg(pt, id1);
        expect(prod.msg).to.eql(p1);
        // same successufull message should not be processed
        mp.consume(m1);
        await delay(pt);
        expect(prod.topic).to.eql(cfg.topics.outbound.error);
        expect(prod.msg).to.eql(p1.clone());

        mp.consume(m1);
        await delay(pt);
        expect(prod.topic).to.eql(cfg.topics.outbound.dead);
        expect(prod.msg).to.eql(p1.clone());
      });

      it/*.only*/('success/error', async function() {
        this.timeout(0); // disable time-out
        let mp:MsgProc = new MsgProc(cfg, prod);
        const id1:string = "transaction-3";
        const id2:string = "other-transaction";
        let m1:PingMsg = new PingMsg(false, id1);
        mp.consume(m1);
        await delay(pt);
        expect(prod.topic).to.eql(cfg.topics.outbound.success);

        m1 = new PingMsg(true,id2);
        mp.consume(m1);
        await delay(pt);
        expect(prod.topic).to.eql(cfg.topics.outbound.error);
        let p1:PongMsg = new PongMsg(pt, id2);
        expect(prod.msg).to.eql(p1);
        // same successufull message should not be processed
        mp.consume(m1);
        await delay(pt);
        expect(prod.topic).to.eql(cfg.topics.outbound.error);
        expect(prod.msg).to.eql(p1.clone());

        mp.consume(m1);
        await delay(pt);
        expect(prod.topic).to.eql(cfg.topics.outbound.dead);
        expect(prod.msg).to.eql(p1.clone());
      });

    });
  });

});
