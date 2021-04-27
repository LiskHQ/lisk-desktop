/* istanbul ignore file */
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import { getForgers, getDelegates } from '@api/delegate';
import { getNetworkStatus } from '@api/network';
import { getTransactions, getRegisteredDelegates } from '@api/transaction';
import withData from '@utils/withData';
import withFilters from '@utils/withFilters';
import { MODULE_ASSETS_NAME_ID_MAP, MAX_BLOCKS_FORGED, tokenMap } from '@constants';

import Delegates from './delegates';

const defaultUrlSearchParams = { search: '' };
const delegatesKey = 'delegates';
const standByDelegatesKey = 'standByDelegates';

const transformDelegatesResponse = (response, oldData = []) => (
  [...oldData, ...response.data.filter(
    delegate => !oldData.find(({ username }) => username === delegate.username),
  )]
);

const transformAccountsIsDelegateResponse = (response, oldData = []) => {
  response.data = response.data.map(del => ({
    address: del.summary.address,
    ...del.dpos.delegate,
  }));
  return transformDelegatesResponse(response, oldData);
};

const transformVotesResponse = (response, oldData = []) => (
  [...oldData, ...response.data.filter(
    vote => !oldData.find(({ id }) => id === vote.id),
  )]
);

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
            status: 'standby',
          },
        }),
        defaultData: [],
        autoload: true,
        transformResponse: transformAccountsIsDelegateResponse,
      },

      delegatesCount: {
        apiUtil: network => getDelegates({ network, params: { limit: 1 } }),
        defaultData: 0,
        autoload: true,
        transformResponse: response => response.meta.total,
      },

      transactionsCount: {
        apiUtil: network => getTransactions({ network, params: { limit: 1 } }, tokenMap.LSK.key),
        defaultData: 0,
        autoload: true,
        transformResponse: response => response.meta.total,
      },

      registrations: {
        apiUtil: network => getRegisteredDelegates({
          network,
        }, tokenMap.LSK.key),
        defaultData: [],
        autoload: true,
      },

      votes: {
        apiUtil: (network, params) => getTransactions({
          network,
          params: { ...params, moduleAssetId: MODULE_ASSETS_NAME_ID_MAP.voteDelegate, sort: 'timestamp:desc' },
        }, tokenMap.LSK.key),
        getApiParams: state => ({ token: state.settings.token.active }),
        autoload: true,
        defaultData: [],
        transformResponse: transformVotesResponse,
      },

      networkStatus: {
        apiUtil: network => getNetworkStatus({ network }),
        defaultData: {},
        autoload: true,
        transformResponse: response => response,
      },

      sanctionedDelegates: {
        apiUtil: (network, params) => getDelegates({ network, params: { ...params, status: 'punished,banned' } }),
        defaultData: [],
        autoload: true,
        transformResponse: transformAccountsIsDelegateResponse,
      },

      votedDelegates: {
        apiUtil: ({ networks }, params) =>
          getDelegates({ network: networks.LSK, params }),
        defaultData: {},
        transformResponse: (response) => {
          const transformedResponse = transformDelegatesResponse(response);
          const responseMap = transformedResponse.reduce((acc, delegate) => {
            acc[delegate.address] = delegate.summary?.address;
            return acc;
          }, {});
          return responseMap;
        },
      },

      watchedDelegates: {
        apiUtil: ({ networks }, params) =>
          getDelegates({ network: networks.LSK, params }),
        defaultData: [],
        getApiParams: state => ({ addressList: state.watchList }),
        transformResponse: transformDelegatesResponse,
      },
    },
  ),
  withFilters(standByDelegatesKey, defaultUrlSearchParams),
  withTranslation(),
)(Delegates);

export default ComposedDelegates;
