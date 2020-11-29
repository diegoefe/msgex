import { expect } from 'chai';
import 'mocha';

import { PingMsg, PongMsg, MsgProc } from '../src/msgproc';

describe('Message processor', 
  () => { 
    it('Msg creation', () => { 
      let ping = new PingMsg(false);
      expect(ping.payload).to.eql({ message:"ping", force_error:false });
      const time:number=10000;
      let pong = new PongMsg(time);
      expect(pong.payload).to.eql({ message:"pong", processing_time:time });
  }); 
});
