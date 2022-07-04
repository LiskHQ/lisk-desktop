// import React from 'react';
import { compose } from 'redux';
import { withTranslation } from 'react-i18next';

import withData from 'src/utils/withData';
import { getTransactionStats } from '@transaction/api';
import Overview from './Overview';

export default compose(
  withData(
    {
      txStats: {
        apiUtil: (network, { token, period }) =>
          getTransactionStats({ network, params: { period } }, token),
        defaultData: {
          distributionByType: {},
          distributionByAmount: {},
          timeline: [],
        },
        autoload: true,
        defaultUrlSearchParams: { period: 'week' },
        transformResponse: response => response.data,
      },
    },
  ),
  withTranslation(),
)(Overview);
