/* istanbul ignore file */
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import moment from 'moment';
import { connect } from 'react-redux';

import { getDelegates, getForgers } from '../../../../utils/api/delegate';
import { getNetworkStatus } from '../../../../utils/api/network';
import { getTransactions } from '../../../../utils/api/transaction';
import withData from '../../../../utils/withData';
import withFilters from '../../../../utils/withFilters';
import transactionTypes from '../../../../constants/transactionTypes';
import { MAX_BLOCKS_FORGED } from '../../../../constants/delegates';
import { tokenMap } from '../../../../constants/tokens';

import Delegates from './delegates';

const defaultUrlSearchParams = { search: '' };
const delegatesKey = 'delegates';
const standByDelegatesKey = 'standByDelegates';
const numberOfActiveDelegates = 103;

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

const mapStateToProps = state => ({
  watchList: state.watchList,
});

const ComposedDelegates = compose(
  withRouter,
  connect(mapStateToProps),
  withData(
    {
      [delegatesKey]: {
        apiUtil: (network, params) => getForgers(
          { network, params: { ...params, limit: MAX_BLOCKS_FORGED } },
        ),
        defaultData: [],
        autoload: true,
        transformResponse: transformDelegatesResponse,
      },

      [standByDelegatesKey]: {
        apiUtil: (network, params) => getDelegates({
          network,
          params: {
            ...params,
            limit: params.limit || 30,
            offset: params.offset || numberOfActiveDelegates,
          },
        }),
        defaultData: [],
        autoload: true,
        transformResponse: (response, oldData) => transformDelegatesResponse({
          data: response.data.filter(delegate => delegate.status === 'standby'),
          meta: response.meta,
        }, oldData),
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
          params: { ...params, type: transactionTypes().vote.code.new, sort: 'timestamp:desc' },
        }, tokenMap.LSK.key),
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

      votedDelegates: {
        apiUtil: ({ networks }, params) => getDelegates({ network: networks.LSK, params }),
        defaultData: {},
        transformResponse: (response) => {
          const transformedResponse = transformDelegatesResponse(response);
          const responseMap = transformedResponse.reduce((acc, delegate) => {
            acc[delegate.address] = delegate;
            return acc;
          }, {});
          return responseMap;
        },
      },

      watchedDelegates: {
        apiUtil: ({ networks }, params) => getDelegates({ network: networks.LSK, params }),
        defaultData: {},
        getApiParams: state => ({ addressList: state.watchList }),
        transformResponse: response => response.data,
      },
    },
  ),
  withFilters(standByDelegatesKey, defaultUrlSearchParams),
  withTranslation(),
)(Delegates);

export default ComposedDelegates;
