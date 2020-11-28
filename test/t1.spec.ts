import { expect } from 'chai';
import 'mocha';

const helloTest = () => { return true; }

describe('simple test', 
  () => { 
    it('should return true', () => { 
      const result = helloTest();
      expect(result).to.equal(true); 
  }); 
});
