import removeDuplicateTransactions from './transactions';

describe('Remove duplicate transactions', () => {
  it('should remove duplicates from pending and confirmed lists', () => {
    const pendingTransactions = [{ id: 1 }, { id: 2 }, { id: 3 }];
    const confirmedTransactions = [{ id: 2 }, { id: 1 }, { id: 4 }];
    const result = removeDuplicateTransactions(pendingTransactions, confirmedTransactions);
    expect(result).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }]);
  });
});
