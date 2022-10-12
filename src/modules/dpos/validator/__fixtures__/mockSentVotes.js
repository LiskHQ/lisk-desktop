/* eslint-disable  max-lines, import/prefer-default-export */

const generateVote = [
  {
    delegateAddress: `lskgtrrftvoxhtknhamjab5wenfauk32z9pzk79uj`,
    amount: `1000000000`,
    name: 'liskhq',
  },
  {
    delegateAddress: `lskdxc4ta5j43jp9ro3f8zqbxta9fn6jwzjucw7yt`,
    amount: `100000000`,
    name: 'liskhq',
  },
  {
    delegateAddress: `lskhbxua8tpdckcewntcttfqfo4rbatampo2dgrno`,
    amount: `1000000000`,
    name: 'liskhq',
  },
  {
    delegateAddress: `lsk93msac7pppaqaxy2w84fcpfvq45caxtguednsp`,
    amount: `1000000000`,
    name: 'liskhq',
  },
  {
    delegateAddress: `lsktusrzku8a8adxxcqqx83msxz34dphs8k4xmnhb`,
    amount: `1000000000`,
    name: 'liskhq',
  },
  {
    delegateAddress: `lsktzb4j7e3knk4mkxckdr3y69gtu2nwmsb3hjbkg`,
    amount: `1000000000`,
    name: 'liskhq',
  },
  {
    delegateAddress: `lsk74ar23k2zk3mpsnryxbxf5yf9ystudqmj4oj6e`,
    amount: `1000000000`,
    name: 'liskhq',
  },
];

const data = {
  votes: generateVote,
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
