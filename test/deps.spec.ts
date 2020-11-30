import { expect } from 'chai';
import 'mocha';

// tested deps
import { v4 as uuidv4 } from 'uuid';
import sinon, { stubInterface } from "ts-sinon";

interface Subject {
  setup(data:string) : void;
}

class Actor {
  data_:string;
  constructor(_data:string) {
    this.data_ = _data;
  }
  setIt(_subject:Subject) {
    _subject.setup(this.data_);
  }
}

describe('dependencies', 
  () => { 
    it('uuid: unique ids should never be duplicate', () => { 
      let ids:string[] = [];
      for(let c=0; c<1000; ++c) {
        const uid = uuidv4();
        expect(ids.indexOf(uid)).to.equal(-1)
        ids.push(uid);
      }
    });
    
    it('ts-sinon: mocks should work', () => { 
      const data:string = "some data";
      let act:Actor = new Actor(data);
      let john = {
        setup: sinon.spy()
      }
      act.setIt(john);
      expect(john.setup.calledOnce).to.be.true;
      expect(john.setup.firstCall.args[0]).to.equal(data);
    });

  });
