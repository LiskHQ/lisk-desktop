const delegate = index => ({
  username: `genesis_${index}`,
  vote: '9987212990000000',
  rewards: '4500000000',
  producedBlocks: 30 + (index % 3),
  missedBlocks: 3 - (index % 3),
  productivity: (((30 + (index % 3)) / (3 - (index % 3))) * 100).toFixed(2),
  rank: index,
  account: {
    address: `1401833615129611201${index}L`,
    publicKey: `3ff32442bb6da7d60c1b7752b24e6467813c9b698e0f278d48c43580da972${index}`,
    secondPublicKey: '',
  },
  approval: 100 - (index % 5),
});

const delegates = Array(101).fill(1).map((item, index) => delegate(index));

export default delegates;
