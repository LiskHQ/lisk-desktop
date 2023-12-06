const transaction = (index) => ({
  id: `22267562542235376${index}`,
  moduleCommandID: index >= 15 ? '5:1' : '2:0',
  moduleCommand: 'token:transfer',
  nonce: '111',
  fee: '1000000',
  sender: {
    address: 'lsk24cd35u4jdq8szo3pnsqe5dsxwrnazyqqqg5eu',
    publicKey: '2ca9a7...c23079',
    name: 'genesis_51',
  },
  params: {
    // Depends on moduleCommandID
    amount: '150000000',
    recipientAddress: 'lsk24cd35u4jdq8szo3pnsqe5dsxwrnazyqqqg5eu',
    data: 'message',
    stakes:
      index >= 15
        ? [
            {
              validatorAddress: 'lskkkb9gcggfqzsusrnu7zb9uzfop96u7596zr5w2',
            },
            {
              validatorAddress: 'lskma5wphbxzf8zkvwumtamjosauzdo5s2qepgrty',
            },
          ]
        : undefined,
  },
  block: {
    id: 35998991827805762 + index,
    height: 8350681 + index,
    timestamp: 28227090,
    isFinal: true,
  },
  confirmations: 22 + index,
  executionStatus: 'Successful',
  meta: {
    recipient: {
      address: 'lsktk7bj2yadx5vq3f87gh5cwca7ptpk5djpxhhc3',
      publicKey: '2ca9a7...c23079',
      name: 'genesis_49',
    },
  },
});

const transactions = Array(30)
  .fill(1)
  .map((item, index) => transaction(index));

/* eslint-disable import/prefer-default-export */
export const mockTransactions = {
  meta: {
    count: 2,
    offset: 0,
    total: 30,
  },
  data: transactions,
};
