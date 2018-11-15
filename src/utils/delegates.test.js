import { expect } from 'chai';
import { updateDelegateCache, loadDelegateCache } from './delegates';
import accounts from '../../test/constants/accounts';

describe('Delegates Utils', () => {
  const storage = {};

  beforeEach(() => {
    window.localStorage.getItem = key => (storage[key]);
    window.localStorage.setItem = (key, item) => { storage[key] = item; };
  });

  const item = [{ ...accounts.genesis, username: 'test' }];
  const itemExpected = {
    [accounts.genesis.address]: {
      publicKey: accounts.genesis.publicKey,
      username: 'test',
    },
  };

  it('sets and gets the item', () => {
    const liskAPIClient = { options: { address: 'item' } };
    updateDelegateCache(item, liskAPIClient);
    expect(loadDelegateCache(liskAPIClient)).to.eql(itemExpected);
  });
});
