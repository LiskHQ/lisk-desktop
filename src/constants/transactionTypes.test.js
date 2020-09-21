import transactionTypes from './transactionTypes';

describe('Constants: transactionTypes', () => {
  it.skip('should return a config object of transaction types based on the API version', () => {
    const types = transactionTypes();
    expect(types.transfer.code).toEqual({
      legacy: 0,
      new: 8,
    });
  });
  it('should return transaction config for a given transaction code', () => {
    const txConfig = transactionTypes.getByCode(0);
    expect(txConfig).toEqual({
      code: { legacy: 0, new: 8 },
      key: 'transfer',
      title: 'Send',
      hardCap: 10000000,
      nameFee: 0,
      outgoingCode: 8,
      senderLabel: 'Sender',
    });
  });
  it('should return null for an invalid given transaction code', () => {
    const txConfig = transactionTypes.getByCode(30);
    expect(txConfig).toEqual(null);
  });
  it('should return an array of values for any given key', () => {
    const keysList = transactionTypes.getListOf('key');
    expect(keysList).toEqual([
      'transfer',
      'secondPassphrase',
      'registerDelegate',
      'castVotes',
      'createMultiSig',
    ]);
  });
});
