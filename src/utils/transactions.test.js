import removeDuplicateTransactions, { findTransactionSizeInBytes } from './transactions';
import transactionTypes from '../constants/transactionTypes';
import accounts from '../../test/constants/accounts';

const TESTNET_NETHASH = 'da3ed6a45429278bac2666961289ca17ad86595d33b31037615d4b8e8f158bba';

describe('Remove duplicate transactions', () => {
  it('should remove duplicates from pending and confirmed lists', () => {
    const pendingTransactions = [{ id: 1 }, { id: 2 }, { id: 3 }];
    const confirmedTransactions = [{ id: 2 }, { id: 1 }, { id: 4 }];
    const result = removeDuplicateTransactions(pendingTransactions, confirmedTransactions);
    expect(result).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }]);
  });
});

describe('findTransactionSizeInBytes', () => {
  const testTx = {
    amount: '1',
    data: 'payment',
    passphrase: accounts.genesis.passphrase,
    recipientId: '123L',
    timeOffset: 0,
    nonce: '1',
    fee: '123',
    senderPublicKey: accounts.genesis.publicKey,
    network: {
      networks: {
        LSK: { networkIdentifier: TESTNET_NETHASH },
      },
    },
  };

  it('should return the correct transaction size', () => {
    const size = findTransactionSizeInBytes({ type: transactionTypes().send.key, transaction: testTx });
    expect(size).toBe(165);
  });
});
