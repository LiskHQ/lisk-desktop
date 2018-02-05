import { expect } from 'chai';
import keyAction from './keyAction';
import keyCodes from './../../constants/keyCodes';
import localJSONStorage from './../../utils/localJSONStorage';

describe('Search KeyAction', () => {
  const storage = {};

  beforeEach(() => {
    window.localStorage.getItem = key => (storage[key]);
    window.localStorage.setItem = (key, item) => { storage[key] = item; };
  });

  it('saves the last 3 searches without duplicates on enter', () => {
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
      keyAction({ which: keyCodes.enter, target: { value } }, []);
    });

    expect(localJSONStorage.get('searches')).to.eql(expectedOutcome);
  });
});
