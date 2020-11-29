import { expect } from 'chai';
import 'mocha';

import { Msg, MsgProc } from '../src/msgproc';

describe('Message processor', 
  () => { 
    it('Msg creation', () => { 
      let m1 = new Msg("ping", false);
      expect(m1.payload).to.eql({ text:"ping", force_error:false });
      let m2 = new Msg("pong", true);
      expect(m1.payload).to.eql({ text:"ping", force_error:false });
  }); 
});
