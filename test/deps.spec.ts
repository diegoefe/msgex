import { expect } from 'chai';
import 'mocha';

import { v4 as uuidv4 } from 'uuid';

describe('dependencies', 
  () => { 
    it('unique ids should never be duplicate', () => { 
      let ids:string[] = [];
      for(let c=0; c<1000; ++c) {
        const uid = uuidv4();
        expect(ids.indexOf(uid)).to.equal(-1)
        ids.push(uid);
      }
  }); 
});
