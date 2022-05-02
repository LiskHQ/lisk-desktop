/* istanbul ignore file */
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import { getDelegates } from '@dpos/validator/api';
import { getNetworkStatus } from '@network/utils/api';
import { getTransactions, getRegisteredDelegates } from '@transaction/utilities/api';
import withData from '@common/utilities/withData';
import withFilters from '@common/utilities/withFilters';
import { DEFAULT_LIMIT } from '@views/configuration';
import { MODULE_ASSETS_NAME_ID_MAP } from '@transaction/configuration/moduleAssets';
import { tokenMap } from '@token/configuration/tokens';
import Delegates from './delegates';

const defaultUrlSearchParams = { search: '' };

/**
 * Merges two arrays and ensures there's no duplicated item
 *
 * @param {String} key - Key to find in array members to ensure uniqueness
 * @param {Array} newData - The new data array
 * @param {Array} oldData - The old data array
 * @returns {Array} Array build by merging the given two arrays
 */
const mergeUniquely = (key, newData, oldData = []) => [
  ...oldData,
  ...newData.data.filter(
    (newItem) => !oldData.find((oldItem) => oldItem[key] === newItem[key]),
  ),
];
const mergeUniquelyByUsername = mergeUniquely.bind(this, 'username');
const mergeUniquelyById = mergeUniquely.bind(this, 'id');

/**
 * Strips down the account data to have a
 * similar structure to getForgers used to
 * retrieve in-round delegates
 */
const stripAccountDataAndMerge = (response, oldData = []) => {
  response.data = response.data.map((del) => ({
    address: del.summary.address,
    ...del.dpos.delegate,
  }));
  return mergeUniquelyByUsername(response, oldData);
};

const mapStateToProps = (state) => ({
  watchList: state.watchList,
  blocks: state.blocks,
});

const ComposedDelegates = compose(
  withRouter,
  connect(mapStateToProps),
  withData({
    standByDelegates: {
      apiUtil: (network, params) =>
        getDelegates({
          network,
          params: {
            ...params,
            limit: params.limit || DEFAULT_LIMIT,
            status: 'standby,non-eligible',
          },
        }),
      defaultData: [],
      autoload: true,
      transformResponse: stripAccountDataAndMerge,
    },

    delegatesCount: {
      apiUtil: (network) => getDelegates({ network, params: { limit: 1 } }),
      defaultData: 0,
      autoload: true,
      transformResponse: (response) => response.meta.total,
    },

    transactionsCount: {
      apiUtil: (network) =>
        getTransactions({ network, params: { limit: 1 } }, tokenMap.LSK.key),
      defaultData: 0,
      autoload: true,
      transformResponse: (response) => response.meta.total,
    },

    registrations: {
      apiUtil: (network) =>
        getRegisteredDelegates(
          {
            network,
          },
          tokenMap.LSK.key,
        ),
      defaultData: [],
      autoload: true,
    },

    votes: {
      apiUtil: (network, params) =>
        getTransactions(
          {
            network,
            params: {
              ...params,
              moduleAssetId: MODULE_ASSETS_NAME_ID_MAP.voteDelegate,
              sort: 'timestamp:desc',
            },
          },
          tokenMap.LSK.key,
        ),
      getApiParams: (state) => ({ token: state.settings.token.active }),
      autoload: true,
      defaultData: [],
      transformResponse: mergeUniquelyById,
    },

    networkStatus: {
      apiUtil: (network) => getNetworkStatus({ network }),
      defaultData: {},
      autoload: true,
      transformResponse: (response) => response,
    },

    sanctionedDelegates: {
      apiUtil: (network, params) =>
        getDelegates({
          network,
          params: { ...params, status: 'punished,banned' },
        }),
      defaultData: [],
      autoload: true,
      transformResponse: stripAccountDataAndMerge,
    },

    votedDelegates: {
      apiUtil: ({ networks }, params) =>
        getDelegates({ network: networks.LSK, params }),
      defaultData: {},
      transformResponse: (response) => {
        const transformedResponse = mergeUniquelyByUsername(response);
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
      getApiParams: (state) => ({ addressList: state.watchList }),
      transformResponse: stripAccountDataAndMerge,
    },
  }),
  withFilters('standByDelegates', defaultUrlSearchParams),
  withTranslation(),
)(Delegates);

export default ComposedDelegates;
