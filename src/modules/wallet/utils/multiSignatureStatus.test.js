import mockSavedAccounts from '@tests/fixtures/accounts';
import accounts from '@tests/constants/wallets';
import { getMultiSignatureStatus } from './multiSignatureStatus';

const mockCurrentAccount = mockSavedAccounts[0];

describe('TxSignatureCollector', () => {
  const transactionJSON = {
    senderPublicKey: mockSavedAccounts[0].metadata.pubkey,
    module: 'auth',
    command: 'registerMultisignature',
    fee: '1000000',
    nonce: '1',
    signatures: [''],
    params: {
      mandatoryKeys: ['mandatory-1'],
      optionalKeys: ['public-1'],
      signatures: [],
    },
  };
  const senderAccount = {
    mandatoryKeys: [],
    optionalKeys: [],
    publicKey: accounts.genesis.summary.publicKey,
  };
  const account = {
    summary: {
      address: 'lskrkta66wqm6rxupokrregnzba3jk97hvny8bzah',
      publicKey: '8b5118c707192b165051e5dfb7d791fbb87987eea05ddf58b7838d50bfd01d45',
      legacyAddress: '1775591385560590229L',
      balance: '10000000000000',
      username: 'eni_validator',
      isMigrated: true,
      isValidator: true,
      isMultisignature: false,
    },
    keys: {
      numberOfSignatures: [],
      mandatoryKeys: [],
      optionalKeys: [],
    },
  };

  it('should return canSenderSignTx as false', () => {
    const currentAccount = mockCurrentAccount;
    const { canSenderSignTx } = getMultiSignatureStatus({
      senderAccount,
      account,
      transactionJSON,
      currentAccount,
    });

    expect(canSenderSignTx).toBeFalsy();
  });

  it('should return canSenderSignTx as true', () => {
    const currentAccount = {
      ...mockCurrentAccount,
      metadata: { pubkey: transactionJSON.senderPublicKey },
    };
    transactionJSON.params.signatures = ['', ''];

    const { canSenderSignTx } = getMultiSignatureStatus({
      senderAccount,
      account,
      transactionJSON,
      currentAccount,
    });

    expect(canSenderSignTx).toBeTruthy();
  });
});
