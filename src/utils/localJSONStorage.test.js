import { expect } from 'chai';
import localJSONStorage from './localJSONStorage';

describe('localJSONStorage', () => {
  const storage = {};

  beforeEach(() => {
    window.localStorage.getItem = key => (storage[key]);
    window.localStorage.setItem = (key, item) => { storage[key] = item; };
    window.localStorage.removeItem = (key) => { storage[key] = undefined; };
  });

  const item = { test: 'test' };

  it('sets and gets the item', () => {
    localJSONStorage.set('item', item);
    expect(localJSONStorage.get('item')).to.eql(item);
  });

  it('sets and deletes the item', () => {
    localJSONStorage.set('item', item);
    localJSONStorage.remove('item');
    expect(storage.getItem).to.equal(undefined);
  });
});
