import removeDuplicateTransactions, { getTxAmount } from './transactions';

describe('Remove duplicate transactions', () => {
  it('should remove duplicates from pending and confirmed lists', () => {
    const pendingTransactions = [{ id: 1 }, { id: 2 }, { id: 3 }];
    const confirmedTransactions = [{ id: 2 }, { id: 1 }, { id: 4 }];
    const result = removeDuplicateTransactions(pendingTransactions, confirmedTransactions);
    expect(result).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }]);
  });
});

describe('getTxAmount', () => {
  it('returns transaction.amount', () => {
    const amount = getTxAmount({
      amount: 100,
    });
    expect(amount).toBe(100);
  });

  it('returns sum of unlocking objects if transaction.type is an unlock transaction', () => {
    const amount = getTxAmount({
      type: 5,
      asset: {
        unlockingObjects: [
          { amount: 100 },
          { amount: 200 },
        ],
      },
    });
    expect(amount).toBe('300');
  });
});
