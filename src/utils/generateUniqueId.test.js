import { expect } from 'chai';
import generateUniqueId from './generateUniqueId';

describe('genearateUniqueId', () => {
  let generatedUniqueId;
  beforeEach(() => {
    generatedUniqueId = generateUniqueId();
  });

  it('should not generate two equal ids', () => {
    const uniqueId = generateUniqueId();
    expect(uniqueId).to.not.equal(generatedUniqueId);
  });
});
