import validators from '../../../../../tests/constants/validators';

const generateStakes = validators.slice(0, 7).map((validator, index) => ({
  address: validator.address,
  amount: `${(index + 1) * 1000000000}`,
  name: validator.name,
}));

const data = {
  stakes: generateStakes,
  account: {
    address: 'lsk24cd35u4jdq8szo3pnsqe5dsxwrnazyqqqg5eu',
    publicKey: 'aq02qkbb35u4jdq8szo3pnsqe5dsxwrnazyqqqg5eu',
    name: 'genesis_56',
    stakesUsed: 10,
  },
};

export const mockSentStakes = {
  data,
  meta: {
    count: 7,
    offset: 0,
    total: 30,
  },
};
