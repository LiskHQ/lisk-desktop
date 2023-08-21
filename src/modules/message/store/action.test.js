import { cryptography } from '@liskhq/lisk-client';
import { mockHWAccounts } from '@hardwareWallet/__fixtures__';
import * as signMessageUtil from '@wallet/utils/signMessage';
import { getUnsignedNonProtocolMessage, signMessage } from './action';

jest.spyOn(cryptography.ed, 'signAndPrintMessage');
jest.spyOn(cryptography.ed, 'printSignedMessage');
jest.spyOn(signMessageUtil, 'signMessageUsingHW');

describe('balanceReclaimed', () => {
  const message = 'test-message';
  const nextStep = jest.fn();
  const privateKey =
    '314852d7afb0d4c283692fef8a2cb40e30c7a5df2ed79994178c10ac168d6d977ef45cd525e95b7a86244bbd4eb4550914ad06301013958f4dd64d32ef7bc588';
  const publicKey = '7ef45cd525e95b7a86244bbd4eb4550914ad06301013958f4dd64d32ef7bc588';
  const signature =
    '68937004b6720d7e1902ef05a577e6d9f9ab2756286b1f2ae918f8a0e5153c15e4f410916076f750b708f8979be2430e4cfc7ebb523ae1905d2ea1f5d24ce700';
  const defaultPrintedMessage = `
      -----BEGIN LISK SIGNED MESSAGE-----
      -----MESSAGE-----
      ${message}
      -----PUBLIC KEY-----
      ${publicKey}
      -----SIGNATURE-----
      ${signature}
      -----END LISK SIGNED MESSAGE-----
    `.trim();

  it('should dispatch transactionCreatedSuccess', async () => {
    cryptography.ed.signAndPrintMessage.mockReturnValue(defaultPrintedMessage);
    cryptography.ed.printSignedMessage.mockReturnValue(defaultPrintedMessage);

    await signMessage({ nextStep, privateKey, message })();

    expect(cryptography.ed.signAndPrintMessage).toHaveBeenCalledWith(
      message,
      Buffer.from(privateKey, 'hex')
    );
    expect(nextStep).toHaveBeenCalledWith({
      signature: defaultPrintedMessage,
      message,
    });
  });

  it('should dispatch transactionCreatedSuccess', async () => {
    const mockCurrentAccount = mockHWAccounts[0];
    await signMessage({ nextStep, privateKey, message, currentAccount: mockCurrentAccount })();

    expect(signMessageUtil.signMessageUsingHW).toHaveBeenCalledWith({
      message: getUnsignedNonProtocolMessage(message),
      account: mockCurrentAccount,
    });
  });
});
