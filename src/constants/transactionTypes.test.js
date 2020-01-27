import transactionTypes from './transactionTypes';
import store from '../store';

describe('Constants: transactionTypes', () => {
  beforeEach(() => {
    store.getState = jest
      .fn()
      .mockReturnValue({
        network: {
          ApiVersion: '2.x',
        },
      });
  });

  it.skip('should return a config object of transaction types based on the API version', () => {
    const expectedTypes = {
      createMultiSig: {
        code: 4,
        key: 'createMultiSig',
        title: 'Multisignature creation',
      },
      registerDelegate: {
        code: 2,
        key: 'registerDelegate',
        title: 'Delegate registration',
      },
      send: {
        code: 0,
        key: 'transfer',
        title: 'Send',
      },
      setSecondPassphrase: {
        code: 1,
        title: 'Second passphrase registration',
        key: 'secondPassphrase',
      },
      vote: {
        code: 3,
        key: 'vote',
        title: 'Delegate vote',
      },
    };
    const types = transactionTypes();
    expect(types).toEqual(expectedTypes);
  });
  it.skip('should return transaction config for a given transaction code', () => {
    const txConfig = transactionTypes.getByCode(0);
    expect(txConfig).toEqual({
      code: 0,
      key: 'transfer',
      title: 'Send',
    });
  });
  it('should return null for an invalid given transaction code', () => {
    const txConfig = transactionTypes.getByCode(30);
    expect(txConfig).toEqual(null);
  });
  it('should return an array of values for any given key', () => {
    const codesList = transactionTypes.getListOf('code');
    expect(codesList).toEqual([0, 1, 2, 3, 4]);
    const keysList = transactionTypes.getListOf('key');
    expect(keysList).toEqual([
      'transfer',
      'secondPassphrase',
      'registerDelegate',
      'vote',
      'createMultiSig',
    ]);
  });
});
