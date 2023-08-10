import { cryptography, transactions, codec } from '@liskhq/lisk-client';
import * as signMessage from '@wallet/utils/signMessage';
import moduleCommandSchemas from '@tests/constants/schemas';
import accounts from '@tests/constants/wallets';
import * as clientLedgerHWCommunication from '@libs/hardwareWallet/ledger/ledgerLiskAppIPCChannel/clientLedgerHWCommunication';

import { fromTransactionJSON } from '../encoding';
import { signTransactionByHW } from '.';

const mockSignature = Buffer.from(
  'e44891990718640616ebb0c64562120ae6a3f25d7ba973bb34a4f98cd61acfa066b9303aba4f40cc93aab868a96c99422ef7f01932d6d2ca83c265703c09c30c',
  'hex'
);
const mockTransactionHex = Buffer.from(
  '0a05746f6b656e12087472616e73666572180620002a20c094ebee7ec0c50ebee32918655e089f6e1a604b83bcaa760293c61e0f18ab6f32230a04040000001080c2d72f1a144662903af5e0c0662d9f1d43f087080c723096232200',
  'hex'
);

jest.spyOn(transactions, 'getSigningBytes').mockReturnValue(mockTransactionHex);
jest
  .spyOn(cryptography.address, 'getAddressFromPublicKey')
  .mockReturnValue(accounts.multiSig.summary.address);
jest.spyOn(codec.codec, 'encode').mockReturnValue(mockTransactionHex);
jest
  .spyOn(clientLedgerHWCommunication, 'getSignedMessage')
  .mockResolvedValue({ signature: mockSignature });
jest
  .spyOn(clientLedgerHWCommunication, 'getSignedTransaction')
  .mockResolvedValue({ signature: mockSignature });
jest.spyOn(signMessage, 'signMessageUsingHW').mockResolvedValue(mockSignature);

describe('signTransactionByHW', () => {
  const wallet = {
    hw: {
      path: '20231',
      model: 'Nano S',
      brand: 'Ledger',
    },
    metadata: {
      pubkey: accounts.multiSig.keys.mandatoryKeys[0],
      path: '',
      accountIndex: 1,
      isHW: true,
      address: 'lskyyoff8q6cj4jcrpvcm9yquv6anc5qf7rjggm2t',
    },
  };
  const txInitiatorAccount = accounts.multiSig.keys;
  const chainID = cryptography.utils.getRandomBytes(64);
  const senderAccount = accounts.multiSig.keys;
  const options = {
    messageSchema: moduleCommandSchemas['auth:paramsSchema'],
    txInitiatorAccount,
  };

  it('Should sign params and transaction to register multisignature', async () => {
    // Arrange
    const schema = moduleCommandSchemas['auth:registerMultisignature'];
    const transactionJSON = {
      module: 'auth',
      command: 'registerMultisignature',
      nonce: '1',
      fee: '343000',
      senderPublicKey: accounts.multiSig.keys.mandatoryKeys[0],
      params: {
        mandatoryKeys: accounts.multiSig.keys.mandatoryKeys,
        optionalKeys: accounts.multiSig.keys.optionalKeys,
        numberOfSignatures: 2,
        signatures: [],
      },
      signatures: [],
    };
    const transaction = fromTransactionJSON(transactionJSON, schema);
    const signature1 = cryptography.utils.getRandomBytes(64);
    signMessage.signMessageUsingHW.mockResolvedValue(signature1);

    // Act
    const transactionWithFirstSignature = await signTransactionByHW({
      wallet,
      schema,
      chainID,
      transaction,
      senderAccount,
      options,
    });

    // Assert
    expect(transactionWithFirstSignature.params.signatures[0]).toEqual(signature1);

    // Arrange
    const signature2 = cryptography.utils.getRandomBytes(64);
    signMessage.signMessageUsingHW.mockResolvedValue(signature2);

    // Act
    const transactionWithSecondSignature = await signTransactionByHW({
      wallet: {
        ...wallet,
        metadata: { ...wallet.metadata, pubkey: accounts.multiSig.keys.optionalKeys[0] },
      },
      schema,
      chainID,
      transaction: { ...transactionWithFirstSignature },
      senderAccount,
      options,
    });

    // Assert
    expect(transactionWithSecondSignature.params.signatures[1]).toEqual(signature2);

    // Arrange
    const signature3 = cryptography.utils.getRandomBytes(64);
    signMessage.signMessageUsingHW.mockResolvedValue(signature3);

    // Act
    const transactionWithThirdSignature = await signTransactionByHW({
      wallet: {
        ...wallet,
        metadata: { ...wallet.metadata, pubkey: accounts.multiSig.keys.optionalKeys[1] },
      },
      schema,
      chainID,
      transaction: transactionWithSecondSignature,
      senderAccount,
      options,
    });

    // Assert
    expect(transactionWithThirdSignature.params.signatures[2]).toEqual(signature3);

    // Act
    const fullySignedTransaction = await signTransactionByHW({
      wallet: {
        ...wallet,
        metadata: { ...wallet.metadata, pubkey: accounts.multiSig.keys.mandatoryKeys[0] },
      },
      schema,
      chainID,
      transaction: transactionWithThirdSignature,
      senderAccount,
      options,
    });

    // Assert
    const allSignatures = [signature1, signature2, signature3];
    fullySignedTransaction.params.signatures.forEach((sig, i) => {
      expect(sig).toEqual(allSignatures[i]);
    });
    expect(fullySignedTransaction.signatures[0]).toEqual(mockSignature);
  });
});
