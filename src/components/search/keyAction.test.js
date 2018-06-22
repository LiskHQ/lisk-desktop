import { expect } from 'chai';
import { saveSearch } from './keyAction';
import localJSONStorage from './../../utils/localJSONStorage';

describe('Search KeyAction', () => {
  const storage = {};

  beforeEach(() => {
    window.localStorage.getItem = key => (storage[key]);
    window.localStorage.setItem = (key, item) => { storage[key] = item; };
  });

  it('saves the last 3 searches without duplicates', () => {
    const testValues = [
      '811299173602533L',
      '947273526752682L',
      '',
      '382923358293526L   ',
      '947273526752682L',
    ];

    const expectedOutcome = [
      '947273526752682L',
      '382923358293526L',
      '811299173602533L',
    ];

    testValues.forEach((value) => {
      saveSearch(value);
    });

    expect(localJSONStorage.get('searches')).to.eql(expectedOutcome);
  });
});
