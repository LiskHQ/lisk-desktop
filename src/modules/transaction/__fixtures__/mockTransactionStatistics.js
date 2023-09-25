/* eslint-disable import/prefer-default-export */
import moment from 'moment';

const generateTimeline = (index) => ({
  timestamp: 1663933694256 - 86400000 * index,
  date: moment(1663933694256 - 86400000 * index).format('YYYY-MM-DD'),
  transactionCount: `14447177${index}`,
  volume: `14447177${index}`,
});

const timelineList = Array(30)
  .fill(1)
  .map((_, idx) => generateTimeline(idx));
const data = {
  timeline: {
    '0000000000000000': timelineList,
    '0000000000000001': timelineList,
    '0000000000000002': timelineList,
  },
  distributionByType: {
    'token:transfer': 15,
    'auth:registerMultisignature': 2,
    'pos:registerValidator': 5,
    'pos:stakeValidator': 9,
    'pos:unlock': 4,
    'pos:reportValidatorMisbehavior': 2,
    'legacy:reclaimLSK': 1,
  },
  distributionByAmount: {
    '0000000000000000': {
      '1_10': 173,
      '10_100': 5,
      '100_1000': 13,
      '1000_10000': 4,
      '10000_100000': 2,
    },
  },
};

export const mockTransactionStatistics = {
  data,
  meta: {
    count: 2,
    offset: 0,
    total: 30,
  },
};
