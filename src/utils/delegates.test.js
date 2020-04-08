import { updateDelegateCache, loadDelegateCache } from './delegates';
import accounts from '../../test/constants/accounts';
import networks from '../constants/networks';

describe('Delegates Utils', () => {
  const storage = {};

  beforeEach(() => {
    window.localStorage.getItem = key => (storage[key]);
    window.localStorage.setItem = (key, item) => { storage[key] = item; };
  });

  const delegate = {
    account: { ...accounts.delegate },
    username: accounts.delegate.username,
  };
  const itemExpected = {
    [delegate.username]: delegate,
    [delegate.account.publicKey]: delegate,
  };

  it('sets and gets the delegate item with mainnet', () => {
    const networkConfig = networks.mainnet;
    updateDelegateCache([delegate], networkConfig);
    loadDelegateCache(networkConfig, (data) => {
      expect(data).toEqual(itemExpected);
    });
  });

  it('sets and gets the delegate item with customNode', () => {
    const networkConfig = {
      options: networks.customNode,
      networks: {
        LSK: {
          nodeUrl: 'http://localhost:4000',
        },
      },
      name: networks.customNode.name,
    };
    updateDelegateCache([delegate], networkConfig);
    loadDelegateCache(networkConfig, (data) => {
      expect(data).toEqual(itemExpected);
    });
  });
});
