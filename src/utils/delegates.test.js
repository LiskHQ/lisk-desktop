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

  const delegateItem = [{ account: { ...accounts.genesis }, username: 'test' }];
  const itemExpected = {
    test: {
      account: { ...accounts.genesis },
      username: 'test',
    },
  };

  it('sets and gets the delegate item with mainnet', () => {
    const liskAPIClient = { options: networks.mainnet };
    updateDelegateCache(delegateItem, liskAPIClient);
    expect(loadDelegateCache(liskAPIClient)).to.eql(itemExpected);
  });

  it('sets and gets the delegate item with customNode', () => {
    const liskAPIClient = {
      options: networks.customNode,
      currentNode: 'http://localhost:4000',
    };
    updateDelegateCache(delegateItem, liskAPIClient);
    expect(loadDelegateCache(liskAPIClient)).to.eql(itemExpected);
  });
});
