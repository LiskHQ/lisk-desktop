import * as popsicle from 'popsicle';
import { getNetworkNameBasedOnNethash } from '../../getNetwork';
import i18n from '../../../i18n';
import networks from '../../../constants/networks';

const liskServiceUrl = 'https://service.lisk.io';
const liskServiceTestnetUrl = 'https://testnet-service.lisk.io';

const getServerUrl = (networkConfig) => {
  const name = getNetworkNameBasedOnNethash(networkConfig);
  if (name === networks.mainnet.name) {
    return liskServiceUrl;
  }
  if (name === networks.testnet.name) {
    return liskServiceTestnetUrl;
  }
  throw new Error(i18n.t('This feature is supported only for mainnet and testnet.'));
};

const liskServiceGet = ({
  path, transformResponse = x => x, searchParams = {}, serverUrl = liskServiceUrl,
}) => new Promise((resolve, reject) => {
  popsicle.get(`${serverUrl}${path}?${new URLSearchParams(searchParams)}`)
    .use(popsicle.plugins.parse('json'))
    .then((response) => {
      if (response.statusType() === 2) {
        resolve(transformResponse(response.body));
      } else {
        reject(new Error(response.body.message || response.body.error));
      }
    }).catch((error) => {
      reject(error);
    });
});

const liskServiceApi = {
  getPriceTicker: () => liskServiceGet({
    path: '/api/v1/market/prices',
    transformResponse: response => response.data,
  }),

  getNewsFeed: () => liskServiceGet({ path: '/api/newsfeed' }),

  getLastBlocks: async ({ networkConfig }, searchParams) => liskServiceGet({
    serverUrl: getServerUrl(networkConfig),
    path: '/api/v1/blocks',
    transformResponse: response => response.data,
    searchParams: {
      limit: 20,
      ...searchParams,
    },
  }),

  getBlockDetails: ({ networkConfig }, { id }) => liskServiceGet({
    serverUrl: getServerUrl(networkConfig),
    path: `/api/v1/block/${id}`,
  }),
};

export default liskServiceApi;
