/* eslint-disable  max-lines, import/prefer-default-export */

const generateVote = (index) => ({
  delegateAddress: `lsk24cd35u4jdq8sz${index}ptrn47dsxwrnazyhhkg5eu`,
  amount: `1000${index}`,
  name: 'liskhq',
});

const data = {
  votes: Array(30).fill(1).map((_, idx) => generateVote(idx)),
  account: {
    address: 'lsk24cd35u4jdq8szo3pnsqe5dsxwrnazyqqqg5eu',
    publicKey: 'aq02qkbb35u4jdq8szo3pnsqe5dsxwrnazyqqqg5eu',
    name: 'genesis_56',
    votesUsed: 10,
  },
};

export const mockSentVotes = {
  data,
  meta: {
    count: 2,
    offset: 0,
    total: 30,
  },
};
