import * as communication from '@libs/hwServer/communication';
// import accounts from '@tests/constants/wallets';
import { signTransactionByHW } from '.';

jest.mock('@libs/hwServer/communication', () => ({
  signTransaction: jest.fn(),
}));

describe.skip('signTransactionByHW', () => {
  // @todo fix the temp signature
  const signature = { data: [], type: 'Buffer' };
  it('should return a transaction object with the proper signature', async () => {
    const account = {
      summary: {
        address: 'lskbgyrx3v76jxowgkgthu9yaf3dr29wqxbtxz8yp',
        publicKey: 'fd061b9146691f3c56504be051175d5b76d1b1d0179c5c4370e18534c5882122',
      },
      hwInfo: {
        deviceId: '060E803263E985C022CA2C9B',
        derivationIndex: 0,
      },
    };

    const transactionObject = {
      params: {
        amount: '100000000',
        data: 'testing',
        recipientAddress: 'lskbgyrx3v76jxowgkgthu9yaf3dr29wqxbtxz8yp',
      },
      fee: '10000000',
      module: 2,
      command: 0,
      nonce: '1',
      senderAddress: 'lskdxc4ta5j43jp9ro3f8zqbxta9fn6jwzjucw7yt',
      signatures: [],
    };

    // const keys = {
    //   mandatoryKeys: [Buffer.from(account.summary.publicKey, 'hex'), Buffer.from(accounts.genesis.summary.publicKey, 'hex')],
    //   optionalKeys: [],
    // };

    const networkIdentifier = Buffer.from('15f0dacc1060e91818224a94286b13aa04279c640bd5d6f193182031d133df7c', 'hex');
    const transactionBytes = Buffer.from('15f0dacc1060e91818224a94286b13aa04279c640bd5d6f193182031d133df7c', 'hex');

    const signedTransaction = await signTransactionByHW(
      account,
      networkIdentifier,
      transactionObject,
      transactionBytes,
      // keys,
    );

    expect(signedTransaction.signatures[0]).toEqual(signature);
    expect(communication.signTransaction).toHaveBeenCalledWith({
      deviceId: account.hwInfo.deviceId,
      index: account.hwInfo.derivationIndex,
      networkIdentifier,
      transactionBytes,
    });
  });
});
