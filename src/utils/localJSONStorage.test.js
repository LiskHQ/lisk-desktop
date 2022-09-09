import { expect } from 'chai';
import { setInStorage, getFromStorage, removeStorage } from './localJSONStorage';

describe('localJSONStorage', () => {
  const storage = {};

  beforeEach(() => {
    window.localStorage.getItem = (key) => storage[key];
    window.localStorage.setItem = (key, item) => {
      storage[key] = item;
    };
    window.localStorage.removeItem = (key) => {
      storage[key] = undefined;
    };
  });

  const item = { test: 'test' };

  it('sets and gets the item', () => {
    setInStorage('item', item);
    getFromStorage('item', null, (data) => {
      expect(data).to.eql(item);
    });
  });

  it('returns the backup in case of no result', () => {
    setInStorage('existingButNull', null);
    getFromStorage('existingButNull', [], (data) => {
      expect(data).to.eql([]);
    });
    getFromStorage('notExisting', '', (data) => {
      expect(data).to.eql('');
    });
  });

  it('sets and deletes the item', () => {
    setInStorage('item', item);
    removeStorage('item');
    getFromStorage('item', undefined, (data) => {
      expect(data).to.equal(undefined);
    });
  });
});
