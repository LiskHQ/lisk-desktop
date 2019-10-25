import * as popsicle from 'popsicle';
import { utils } from '@liskhq/lisk-transactions';
import { DEFAULT_LIMIT } from '../../../constants/monitor';
import { getNetworkNameBasedOnNethash } from '../../getNetwork';
import { getTimestampFromFirstBlock } from '../../datetime';
import i18n from '../../../i18n';
import networks from '../../../constants/networks';
import voting from '../../../constants/voting';
import { version } from '../../../../package.json';

const isStaging = () => (
  localStorage.getItem('useLiskServiceStaging') || version.includes('beta') || version.includes('rc')
    ? '-staging' : ''
);

const liskServiceUrl = 'https://service.lisk.io'; // TODO use isStaging() here once the server is available
const liskServiceTestnetUrl = `https://testnet-service${isStaging()}.lisk.io`;

const getServerUrl = (networkConfig) => {
  const name = getNetworkNameBasedOnNethash(networkConfig);
  if (name === networks.mainnet.name) {
    return liskServiceUrl;
  }
  if (name === networks.testnet.name) {
    return liskServiceTestnetUrl;
  }
  const liskServiceDevnetUrl = localStorage.getItem('liskServiceUrl');
  if (liskServiceDevnetUrl) {
    return liskServiceDevnetUrl;
  }
  throw new Error(i18n.t('This feature is supported only for mainnet and testnet.'));
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
    transformResponse: response => response.data,
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

  getDelegates: async (network, { tab, ...rest }) => {
    const tabOptions = {
      active: ({ networkConfig }, { search = '', ...searchParams }) => liskServiceGet({
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
      standby: ({ networkConfig }, { offset = 0, ...searchParams }) => liskServiceGet({
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
    };
    return tabOptions[tab](network, rest);
  },

  getLiskServiceUrl: (networkConfig) => {
    try {
      return getServerUrl(networkConfig);
    } catch (e) {
      return null;
    }
  },

  getNextForgers: async ({ networkConfig }, searchParams) => liskServiceGet({
    networkConfig,
    path: '/api/v1/delegates/next_forgers',
    searchParams: { limit: DEFAULT_LIMIT, ...searchParams },
    transformResponse: response => response.data,
  }),
};

export default liskServiceApi;
