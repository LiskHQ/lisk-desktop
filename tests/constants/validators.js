const delegate = index => ({
  name: `gr33ndrag0n_${index}`,
  totalStakeReceived: `100600000000${index}`,
  selfStake: `10060000000${index}`,
  validatorWeight: `100600000${index}000`,
  address: 'lskhbxua8tpdckcewntcttfqfo4rbatampo2dgrno',
  lastGeneratedHeight: 27605 + index,
  status: 'active',
  isBanned: index < 15,
  rank: index,
  pomHeights: [100 + index],
  punishmentPeriods: [
    {
      start: 100 + index,
      end: 500 + index,
    },
  ],
  consecutiveMissedBlocks: index < 15 ? index + 1 : 0,
});

const delegates = Array(30).fill(1).map((item, index) => delegate(index));

const generateDelegate = (index) => ({
  [`lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y1${index}`]: {
    summary: {
      address: `lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y1${index}`,
      username: `testUsername_${index}`,
    },
  },
});

export const delegateList = (delegateCount = 0) =>
  Array(delegateCount).fill(1).map((_, index) => generateDelegate(index));

export default delegates;
