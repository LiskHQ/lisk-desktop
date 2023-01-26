const generateUnlock = (index) => ({
  validatorAddress: `lsk24cd35u4jdq8szo3pnsqe5dsxwrnazyqqqg${index}eu`,
  amount: `${(index+1) * 1000000000}`,
  tokenID: '0000000000000000',
  unstakeHeight: 30 + index,
  expectedUnlockableHeight: 300 + index,
  unlockable: index > 3,
});

const data = {
  pendingUnlocks: Array(30)
    .fill(1)
    .map((_, idx) => generateUnlock(idx)),
  account: {
    address: 'lsk24cd35u4jdq8szo3pnsqe5dsxwrnazyqqqg5eu',
    publicKey: 'aq02qkbb35u4jdq8szo3pnsqe5dsxwrnazyqqqg5eu',
    name: 'genesis_56',
  },
};

export const mockUnlocks = {
  data,
  meta: {
    count: 2,
    offset: 0,
    total: 30,
  },
};
