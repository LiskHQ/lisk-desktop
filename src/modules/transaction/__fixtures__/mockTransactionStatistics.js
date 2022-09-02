/* eslint-disable import/prefer-default-export */
import moment from 'moment';

const generateTimeline = (index) => ({
  timestamp: 1556100060 + index,
  date: moment(1556100060 + index).format('YYYY-mm-DD'),
  transactionCount: `144471771933${index}`,
  volume: `144471771933${index}`,
});

const data = {
  timeline: Array(30).fill(1).map((_, idx) => generateTimeline(idx)),
  distributionByOperation: {},
  distributionByAmount: {},
};

export const mockTransactionStatistics = {
  data,
  meta: {
    count: 2,
    offset: 0,
    total: 30,
  },
};
