import { cryptography } from '@liskhq/lisk-client';
import { mockHWAccounts } from '@hardwareWallet/__fixtures__';
import * as signMessageUtil from '@wallet/utils/signMessage';
import * as signMessageWithPrivateKeyUtils from '../utils/signMessageWithPrivateKey';
import { signMessage, signClaimMessage } from './action';

jest.spyOn(cryptography.ed, 'signAndPrintMessage');
jest.spyOn(cryptography.ed, 'printSignedMessage');
jest.spyOn(signMessageUtil, 'signMessageUsingHW');
jest.spyOn(signMessageWithPrivateKeyUtils, 'signClaimMessageWithPrivateKey');

const privateKey =
  '314852d7afb0d4c283692fef8a2cb40e30c7a5df2ed79994178c10ac168d6d977ef45cd525e95b7a86244bbd4eb4550914ad06301013958f4dd64d32ef7bc588';
const nextStep = jest.fn();

describe('balanceReclaimed', () => {
  const mockCurrentAccount = mockHWAccounts[0];
  const message = 'test-message';
  const signature =
    '68937004b6720d7e1902ef05a577e6d9f9ab2756286b1f2ae918f8a0e5153c15e4f410916076f750b708f8979be2430e4cfc7ebb523ae1905d2ea1f5d24ce700';
  const defaultPrintedMessage = `
      -----BEGIN LISK SIGNED MESSAGE-----
      -----MESSAGE-----
      ${message}
      -----PUBLIC KEY-----
      ${mockCurrentAccount.metadata.pubkey}
      -----SIGNATURE-----
      ${signature}
      -----END LISK SIGNED MESSAGE-----
    `.trim();

  afterEach(() => {
    jest.clearAllMocks();
  });

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

  it('should call nextStep with signature', async () => {
    signMessageUtil.signMessageUsingHW.mockResolvedValue(defaultPrintedMessage);
    cryptography.ed.printSignedMessage.mockReturnValue(defaultPrintedMessage);
    await signMessage({ nextStep, privateKey, message, currentAccount: mockCurrentAccount })();

    expect(nextStep).toHaveBeenCalledWith({
      signature: defaultPrintedMessage,
      message,
    });
  });

  it('should call nextStep with error', async () => {
    const error = { name: 'An error' };
    signMessageUtil.signMessageUsingHW.mockRejectedValue(error);
    await signMessage({ nextStep, privateKey, message, currentAccount: mockCurrentAccount })();

    expect(nextStep).toHaveBeenCalledWith({
      error,
      message,
    });
  });
});

describe('signClaimMessage', () => {
  const mockCurrentAccount = {
    metadata: {
      pubkey: '5bb1138c01b7762318f5e8a8799573077caadb1c7333a5c631773a2ade4bbdb5',
    },
  };
  const portalMessage =
    '0xe4dbb94d0f19e47b0cff8206bebc1fcf8d892325ab851e1a5bdab954711d926e000000000000000000';
  afterEach(() => jest.clearAllMocks());

  it('should call next step with signature', async () => {
    const claimResult =
      '15e546e6df7a17960c00c80cb42a3968ca004f2d8efd044cb2bb14e83ba173b02fc4c40ad47b0eca722f3022d5d82874fad25a7c0264d8a31e20f17741a4e602';
    signMessageWithPrivateKeyUtils.signClaimMessageWithPrivateKey.mockReturnValue(claimResult);

    const signedClaim = {
      data: {
        pubKey: '5bb1138c01b7762318f5e8a8799573077caadb1c7333a5c631773a2ade4bbdb5',
        r: '0x15e546e6df7a17960c00c80cb42a3968ca004f2d8efd044cb2bb14e83ba173b0',
        s: '0x2fc4c40ad47b0eca722f3022d5d82874fad25a7c0264d8a31e20f17741a4e602',
      },
    };
    await signClaimMessage({
      nextStep,
      portalMessage,
      privateKey,
      currentAccount: mockCurrentAccount,
    })();
    expect(nextStep).toHaveBeenCalledWith({ signature: signedClaim, portalMessage });
  });
});
