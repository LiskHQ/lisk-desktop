// import React from 'react';
import { compose } from 'redux';
import { withTranslation } from 'react-i18next';

import withData from '@common/utilities/withData';
import { getTransactionStats } from '@common/utilities/api/transaction';
import Overview from './overview';

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
