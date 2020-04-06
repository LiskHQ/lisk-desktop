import { expect } from 'chai';
import { setInStorage, getFromStorage, removeStorage } from './localJSONStorage';

describe('localJSONStorage', () => {
  const storage = {};

  beforeEach(() => {
    window.localStorage.getItem = key => (storage[key]);
    window.localStorage.setItem = (key, item) => { storage[key] = item; };
    window.localStorage.removeItem = (key) => { storage[key] = undefined; };
  });

  const item = { test: 'test' };

  it('sets and gets the item', () => {
    setInStorage('item', item);
    expect(getFromStorage('item')).to.eql(item);
  });

  it('returns the backup in case of no result', () => {
    setInStorage('existingButNull', null);
    expect(getFromStorage('existingButNull', [])).to.eql([]);
    expect(getFromStorage('notExisting', '')).to.eql('');
  });

  it('sets and deletes the item', () => {
    setInStorage('item', item);
    removeStorage('item');
    expect(storage.getItem).to.equal(undefined);
  });
});
