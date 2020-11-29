import { expect } from 'chai';
import 'mocha';

import { PingMsg, PongMsg, MsgProc } from '../src/msgproc';

describe('Message processor', 
  () => { 
    it('Msg creation', () => { 
      let ping = new PingMsg(false);
      expect(ping.payload).to.eql({ message:"ping", force_error:false });
      const now = new Date();
      let pong = new PongMsg(now);
      expect(pong.payload).to.eql({ message:"pong", processing_time:now });
  }); 
});
