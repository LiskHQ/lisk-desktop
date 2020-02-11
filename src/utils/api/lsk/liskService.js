import { utils } from '@liskhq/lisk-transactions';
import io from 'socket.io-client';
import * as popsicle from 'popsicle';
import { DEFAULT_LIMIT } from '../../../constants/monitor';
import { getNetworkNameBasedOnNethash } from '../../getNetwork';
import { getTimestampFromFirstBlock } from '../../datetime';
import { version } from '../../../../package.json';
import i18n from '../../../i18n';
import networks from '../../../constants/networks';
import voting from '../../../constants/voting';
import { adaptTransactions } from './adapters';
import transactionTypes from '../../../constants/transactionTypes';

const isStaging = () => (
  localStorage.getItem('useLiskServiceStaging') || version.includes('beta') || version.includes('rc')
    ? '-staging' : ''
);

const liskServiceUrl = `https://mainnet-service${isStaging()}.lisk.io`;
const liskServiceTestnetUrl = `https://testnet-service${isStaging()}.lisk.io`;
const liskServiceBetanetUrl = 'https://betanet-service.lisk.io';

const getServerUrl = (networkConfig) => {
  const name = getNetworkNameBasedOnNethash(networkConfig);
  if (name === networks.mainnet.name) {
    return liskServiceUrl;
  }
  if (name === networks.testnet.name) {
    return liskServiceTestnetUrl;
  }
  if (networkConfig.networks.LSK.nodeUrl.indexOf('betanet') > 0) {
    return liskServiceBetanetUrl;
  }
  if (networkConfig.networks.LSK.nodeUrl.indexOf('liskdev.net') > 0) {
    return networkConfig.networks.LSK.nodeUrl.replace(/:\d{2,4}/, ':9901');
  }
  throw new Error(i18n.t('This feature can be accessed through Mainet and Testnet.'));
};

const formatDate = (value, options) => getTimestampFromFirstBlock(value, 'DD.MM.YY', options);

const liskServiceGet = ({
  path, transformResponse = x => x, searchParams = {}, serverUrl = liskServiceUrl, networkConfig,
}) => new Promise((resolve, reject) => {
  serverUrl = networkConfig ? getServerUrl(networkConfig) : serverUrl;
  popsicle.get(`${serverUrl}${path}?${new URLSearchParams(searchParams)}`)
    .use(popsicle.plugins.parse('json'))
    .then((response) => {
      if (response.statusType() === 2) {
        resolve(transformResponse(response.body));
      } else {
        reject(new Error(response.body.message || response.body.error));
      }
    }).catch((error) => {
      if (error.code === 'EUNAVAILABLE') {
        const networkName = getNetworkNameBasedOnNethash(networkConfig);
        error = new Error(i18n.t('Unable to connect to {{networkName}}', { networkName }));
      }
      reject(error);
    });
});

const liskServiceApi = {
  getPriceTicker: () => liskServiceGet({
    path: '/api/v1/market/prices',
    transformResponse: response => response.data,
  }),

  getNewsFeed: () => liskServiceGet({ path: '/api/newsfeed' }),
  getLastBlocks: async (
    { networkConfig }, { dateFrom, dateTo, ...searchParams },
  ) => liskServiceGet({
    networkConfig,
    path: '/api/v1/blocks',
    transformResponse: response => response.data,
    searchParams: {
      limit: DEFAULT_LIMIT,
      ...searchParams,
      ...(dateFrom && { from: formatDate(dateFrom) }),
      ...(dateTo && { to: formatDate(dateTo, { inclusive: true }) }),
    },
  }),

  getBlockDetails: async ({ networkConfig }, { id }) => liskServiceGet({
    networkConfig,
    path: `/api/v1/block/${id}`,
  }),

  getTransactions: async ({ networkConfig }, {
    dateFrom, dateTo, amountFrom, amountTo, ...searchParams
  }) => liskServiceGet({
    networkConfig,
    path: '/api/v1/transactions',
    transformResponse: response => adaptTransactions(response).data,
    searchParams: {
      limit: DEFAULT_LIMIT,
      ...(dateFrom && { from: formatDate(dateFrom) }),
      ...(dateTo && { to: formatDate(dateTo, { inclusive: true }) }),
      ...(amountFrom && { min: utils.convertLSKToBeddows(amountFrom) }),
      ...(amountTo && { max: utils.convertLSKToBeddows(amountTo) }),
      ...searchParams,
    },
  }),

  getBlockTransactions: async ({ networkConfig }, { id, ...searchParams }) => liskServiceGet({
    networkConfig,
    path: `/api/v1/block/${id}/transactions`,
    searchParams: { limit: DEFAULT_LIMIT, ...searchParams },
  }),

  getStandbyDelegates: async ({ networkConfig }, {
    offset = 0, tab, ...searchParams
  }) => liskServiceGet({
    networkConfig,
    path: '/api/v1/delegates',
    transformResponse: response => response.data.filter(
      delegate => delegate.rank > voting.numberOfActiveDelegates,
    ),
    searchParams: {
      offset: offset + (Object.keys(searchParams).length ? 0 : voting.numberOfActiveDelegates),
      limit: DEFAULT_LIMIT,
      ...searchParams,
    },
  }),

  getActiveDelegates: async ({ networkConfig }, { search = '', tab, ...searchParams }) => liskServiceGet({
    networkConfig,
    path: '/api/v1/delegates/active',
    transformResponse: response => response.data.filter(
      delegate => delegate.username.includes(search),
    ),
    searchParams: {
      limit: voting.numberOfActiveDelegates,
      ...searchParams,
    },
  }),

  /**
   * Returns lisk-service URL based on network name and nethash
   *
   * In particular it resolves mainnet/testnet nethash to coresponding lisk-service instance
   *
   * @param {Object} networkConfig  - structured as network store: src/store/reducers/network.js
   * @param {String} networkConfig.name
   * @param {String} networkConfig.networks.LSK.nethash - if name is "Custom node"
   * @return {String} lisk-service URL
   */
  getLiskServiceUrl: (networkConfig) => {
    try {
      return getServerUrl(networkConfig);
    } catch (e) {
      return null;
    }
  },

  getActiveAndStandByDelegates: async ({ networkConfig }) => liskServiceGet({
    networkConfig,
    path: '/api/v1/delegates',
    searchParams: { limit: 1 },
    transformResponse: response => response.meta,
  }),

  getRegisteredDelegates: async ({ networkConfig }) => liskServiceGet({
    networkConfig,
    path: '/api/v1/transactions',
    searchParams: {
      limit: 100,
      type: transactionTypes().registerDelegate.outgoingCode,
      sort: 'timestamp:desc',
    },
    transformResponse: response => response.data,
  }),

  getNextForgers: async ({ networkConfig }, searchParams) => liskServiceGet({
    networkConfig,
    path: '/api/v1/delegates/next_forgers',
    searchParams: { limit: DEFAULT_LIMIT, ...searchParams },
    transformResponse: response => response.data,
  }),

  getTopAccounts: async ({ networkConfig }, searchParams) => liskServiceGet({
    networkConfig,
    path: '/api/v1/accounts/top',
    searchParams: {
      limit: DEFAULT_LIMIT,
      ...searchParams,
    },
  }),

  getNetworkStatus: async ({ networkConfig }) => liskServiceGet({
    networkConfig,
    path: '/api/v1/network/status',
  }),

  listenToBlockchainEvents: ({ networkConfig, event, callback }) => {
    const socket = io(
      `${liskServiceApi.getLiskServiceUrl(networkConfig)}/blockchain`,
      { transports: ['websocket'] },
    );
    socket.on(event, callback);

    return function cleanUp() {
      socket.close();
    };
  },
};

export default liskServiceApi;
