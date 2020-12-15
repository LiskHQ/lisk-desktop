/* istanbul ignore file */
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import moment from 'moment';
import Delegates from './delegates';
import { getDelegates, getForgers } from '../../../../utils/api/delegate';
import { getNetworkStatus } from '../../../../utils/api/network';
import { getTransactions } from '../../../../utils/api/transaction';
import withData from '../../../../utils/withData';
import withFilters from '../../../../utils/withFilters';
import withLocalSort from '../../../../utils/withLocalSort';
import voting from '../../../../constants/voting';
import transactionTypes from '../../../../constants/transactionTypes';

const defaultUrlSearchParams = { search: '' };
const delegatesKey = 'delegates';
const standByDelegatesKey = 'standByDelegates';

const transformDelegatesResponse = (response, oldData = []) => (
  [...oldData, ...response.data.filter(
    delegate => !oldData.find(({ username }) => username === delegate.username),
  )]
);

const transformVotesResponse = (response, oldData = []) => (
  [...oldData, ...response.data.filter(
    vote => !oldData.find(({ id }) => id === vote.id),
  )]
);

/**
 * This function is to iterate over the list of delegates and GROUP BY
 * timestamp (Month and Year) and count how many users registered as
 * delegate in the month
 */
const transformChartResponse = (response) => {
  const responseFormatted = response.data.reduce((acc, delegate) => {
    const newDelegate = { ...delegate, timestamp: moment(delegate.timestamp * 1000).startOf('month').toISOString() };
    return {
      ...acc,
      [newDelegate.timestamp]: ((acc[newDelegate.timestamp] || 0) + 1),
    };
  }, {});

  return Object.entries(responseFormatted)
    .map(delegate => ({ x: delegate[0], y: delegate[1] }))
    .sort((dateA, dateB) => (dateB.x > dateA.x ? -1 : 1))
    .slice(-4)
    .map(delegate => ({ ...delegate, x: moment(delegate.x).format('MMM YY') }));
};

const ComposedDelegates = compose(
  withRouter,
  withData(
    {
      [delegatesKey]: {
        apiUtil: getForgers,
        defaultData: [],
        autoload: true,
        transformResponse: transformDelegatesResponse,
      },

      [standByDelegatesKey]: {
        apiUtil: getDelegates,
        defaultData: [],
        autoload: true,
        transformResponse: response => transformDelegatesResponse({
          data: response.data.filter(
            delegate => delegate.rank > voting.numberOfActiveDelegates,
          ),
          meta: response.meta,
        }),
      },

      chartActiveAndStandbyData: {
        apiUtil: network => getDelegates({ network, params: { limit: 1 } }),
        defaultData: [],
        autoload: true,
        transformResponse: response => response.meta.total,
      },

      chartRegisteredDelegatesData: {
        apiUtil: network => getDelegates({ network, params: { limit: 100 } }),
        defaultData: [],
        autoload: true,
        transformResponse: transformChartResponse,
      },

      votes: {
        apiUtil: (network, params) => getTransactions({
          network,
          params: { type: transactionTypes().vote.new, sort: 'timestamp:desc' },
        }, params.token),
        getApiParams: state => ({ token: state.settings.token.active }),
        autoload: true,
        defaultData: [],
        transformResponse: transformVotesResponse,
      },

      networkStatus: {
        apiUtil: getNetworkStatus,
        defaultData: {},
        autoload: true,
        transformResponse: response => response,
      },
    },
  ),
  withFilters(standByDelegatesKey, defaultUrlSearchParams),
  withLocalSort(delegatesKey, 'rank:asc'),
  withTranslation(),
)(Delegates);

export default ComposedDelegates;
