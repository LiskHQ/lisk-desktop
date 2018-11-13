import { expect } from 'chai';
import { updateDelegateCache, loadDelegateCache } from './delegates';
import accounts from '../../test/constants/accounts';
import networks from '../constants/networks';

describe('Delegates Utils', () => {
  const storage = {};

  beforeEach(() => {
    window.localStorage.getItem = key => (storage[key]);
    window.localStorage.setItem = (key, item) => { storage[key] = item; };
  });

  const item = [{ account: { ...accounts.genesis }, username: 'test' }];
  const itemExpected = {
    test: {
      account: { ...accounts.genesis },
      username: 'test',
    },
  };

  it('sets and gets the item', () => {
    updateDelegateCache(item, networks.mainnet.code);
    expect(loadDelegateCache(networks.mainnet.code)).to.eql(itemExpected);
  });
});
