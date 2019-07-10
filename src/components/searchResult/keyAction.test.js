import { expect } from 'chai';
import { saveSearch } from './keyAction';
import localJSONStorage from '../../utils/localJSONStorage';

describe('Search KeyAction', () => {
  const storage = {};

  beforeEach(() => {
    window.localStorage.getItem = key => (storage[key]);
    window.localStorage.setItem = (key, item) => { storage[key] = item; };
  });

  it('saves the last 3 searches without duplicates', () => {
    const testValues = [
      { id: '811299173602533L', searchTerm: '811299173602533L' },
      { id: '947273526752682L', searchTerm: '947273526752682L' },
      { id: '', searchTerm: '' },
      { id: '382923358293526L   ', searchTerm: '382923358293526L   ' },
      { id: '947273526752682L   ', searchTerm: '947273526752682L' },
    ];

    const expectedOutcome = [
      { id: '947273526752682L   ', searchTerm: '947273526752682L' },
      { id: '382923358293526L   ', searchTerm: '382923358293526L' },
      { id: '811299173602533L', searchTerm: '811299173602533L' },
    ];

    testValues.forEach((searchObj) => {
      saveSearch(searchObj.searchTerm, searchObj.id);
    });
    expect(localJSONStorage.get('searches')).to.eql(expectedOutcome);
  });
});
