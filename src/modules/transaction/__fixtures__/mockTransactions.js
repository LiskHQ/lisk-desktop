const transaction = index => ({
  id: `22267562542235376${index}`,
  moduleCommandID: '2:0',
  moduleCommandName: 'token:transfer',
  nonce: '0',
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
  },
  block: {
    id: 35998991827805762 + index,
    height: 8350681 + index,
    timestamp: 28227090,
  },
  confirmations: 0 + index,
  executionStatus: 'pending',
  meta: {
    recipient: {
      address: 'lsk24cd35u4jdq8szo3pnsqe5dsxwrnazyqqqg5eu',
      publicKey: '2ca9a7...c23079',
      name: 'genesis_49',
    },
  },
});

const transactions = Array(30).fill(1).map((item, index) => transaction(index));

/* eslint-disable import/prefer-default-export */
export const mockTransactions = {
  meta: {
    count: 2,
    offset: 0,
    total: 30,
  },
  data: transactions,
};
