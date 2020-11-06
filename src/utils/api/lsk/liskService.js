// eslint-disable-next-line import/no-extraneous-dependencies
import { cryptography, transactions } from '@liskhq/lisk-client';
import io from 'socket.io-client';
import * as popsicle from 'popsicle';
import { DEFAULT_LIMIT } from '../../../constants/monitor';
import { getNetworkNameBasedOnNethash } from '../../getNetwork';
import { getTimestampFromFirstBlock } from '../../datetime';
import i18n from '../../../i18n';
import voting from '../../../constants/voting';
import { adaptTransactions } from './adapters';
import transactionTypes from '../../../constants/transactionTypes';

const formatDate = (value, options) => getTimestampFromFirstBlock(value, 'DD.MM.YY', options);

const liskServiceGet = ({
  path, transformResponse = x => x, searchParams = {}, network,
}) => new Promise((resolve, reject) => {
  if (network.serviceUrl === 'unavailable') {
    reject(new Error('Lisk Service is not available for this network.'));
  } else {
    popsicle.get(`${network.serviceUrl}${path}?${new URLSearchParams(searchParams)}`)
      .use(popsicle.plugins.parse('json'))
      .then((response) => {
        if (response.statusType() === 2) {
          resolve(transformResponse(response.body));
        } else {
          reject(new Error(response.body.message || response.body.error));
        }
      }).catch((error) => {
        if (error.code === 'EUNAVAILABLE') {
          const networkName = getNetworkNameBasedOnNethash(network);
          error = new Error(i18n.t('Unable to connect to {{networkName}}', { networkName }));
        }
        reject(error);
      });
  }
});

const liskServiceSocketGet = (request, network) => new Promise((resolve, reject) => {
  const socket = io(`${network.serviceUrl}/rpc`, { transports: ['websocket'] });
  socket.emit('request', request, (response) => {
    if (Array.isArray(response)) {
      resolve(response);
    } else if (response.error) {
      reject(response.error);
    } else {
      resolve(response.result);
    }
  });
});

const liskServiceApi = {
  getPriceTicker: network =>
    liskServiceGet({
      path: '/api/v1/market/prices',
      transformResponse: response => response.data,
      network,
    }),

  getNewsFeed: (network, searchParams) => liskServiceGet({
    path: '/api/v1/market/newsfeed',
    searchParams,
    transformResponse: response => response.data,
    network,
  }),

  getLastBlocks: async (
    network, { dateFrom, dateTo, ...searchParams },
  ) => liskServiceGet({
    path: '/api/v1/blocks',
    searchParams: {
      limit: DEFAULT_LIMIT,
      ...searchParams,
      ...(dateFrom && { from: formatDate(dateFrom) }),
      ...(dateTo && { to: formatDate(dateTo, { inclusive: true }) }),
    },
    network,
  }),

  getBlockDetails: async (network, { id }) => liskServiceGet({
    path: `/api/v1/block/${id}`,
    network,
  }),

  getTransaction: async (network, {
    id,
  }) => liskServiceGet({
    path: `/api/v1/transactions?id=${id}`,
    transformResponse: response => ({
      data: adaptTransactions(response).data,
      meta: response.meta,
    }),
    network,
  }),

  getTransactions: async (network, {
    dateFrom, dateTo, amountFrom, amountTo, ...searchParams
  }) => liskServiceGet({
    path: '/api/v1/transactions',
    transformResponse: response => ({
      data: adaptTransactions(response).data,
      meta: response.meta,
    }),
    searchParams: {
      limit: DEFAULT_LIMIT,
      ...(dateFrom && { from: formatDate(dateFrom) }),
      ...(dateTo && { to: formatDate(dateTo, { inclusive: true }) }),
      ...(amountFrom && { min: transactions.utils.convertLSKToBeddows(amountFrom) }),
      ...(amountTo && { max: transactions.utils.convertLSKToBeddows(amountTo) }),
      ...searchParams,
    },
    network,
  }),

  getBlockTransactions: async (network, { id, ...searchParams }) => liskServiceGet({
    path: `/api/v1/block/${id}/transactions`,
    searchParams: { limit: DEFAULT_LIMIT, ...searchParams },
    network,
  }),

  getStandbyDelegates: async (network, {
    offset = 0, tab, ...searchParams
  }) => liskServiceGet({
    path: '/api/v1/delegates',
    transformResponse: response => ({
      data: response.data.filter(
        delegate => delegate.rank > voting.numberOfActiveDelegates,
      ),
      meta: response.meta,
    }),
    searchParams: {
      offset: offset + (Object.keys(searchParams).length ? 0 : voting.numberOfActiveDelegates),
      limit: DEFAULT_LIMIT,
      ...searchParams,
    },
    network,
  }),

  getActiveDelegates: async (network, { search = '', tab, ...searchParams }) => liskServiceGet({
    path: '/api/v1/delegates/next_forgers',
    transformResponse: response => ({
      data: response.data.filter(
        delegate => delegate.username.includes(search),
      ),
      meta: response.meta,
    }),
    searchParams: {
      limit: voting.numberOfActiveDelegates,
      ...searchParams,
    },
    network,
  }),

  /**
   * Returns lisk-service URL based on network name and nethash
   *
   * In particular it resolves mainnet/testnet nethash to coresponding lisk-service instance
   *
   * @param {Object} network  - structured as network store: src/store/reducers/network.js
   * @param {String} network.name
   * @param {String} network.networks.LSK.nethash - if name is "Custom node"
   * @return {String} lisk-service URL
   */
  getLiskServiceUrl: network => network.serviceUrl,

  getActiveAndStandByDelegates: async network => liskServiceGet({
    path: '/api/v1/delegates',
    searchParams: { limit: 1 },
    network,
  }),

  getRegisteredDelegates: async network => liskServiceGet({
    path: '/api/v1/transactions',
    searchParams: {
      limit: 100,
      type: transactionTypes().registerDelegate.outgoingCode,
      sort: 'timestamp:desc',
    },
    network,
  }),

  getNextForgers: async (network, searchParams) => liskServiceGet({
    path: '/api/v1/delegates/next_forgers',
    searchParams: { limit: DEFAULT_LIMIT, ...searchParams },
    transformResponse: response => response.data,
    network,
  }),

  getTopAccounts: async (network, searchParams) => liskServiceGet({
    path: '/api/v1/accounts/top',
    searchParams: {
      limit: DEFAULT_LIMIT,
      ...searchParams,
    },
    network,
  }),

  getNetworkStatus: async network => liskServiceGet({
    path: '/api/v1/network/status',
    network,
  }),

  getNetworkStatistics: network => liskServiceGet({
    path: '/api/v1/network/statistics',
    network,
  }),

  listenToBlockchainEvents: ({ event, callback, network = { serviceUrl: '' } }) => {
    const socket = io(
      `${network.serviceUrl}/blockchain`,
      { transports: ['websocket'] },
    );
    socket.on(event, callback);

    return function cleanUp() {
      socket.close();
    };
  },

  getTxStats: (network, searchParams) => {
    const config = {
      week: { path: 'day', limit: 7 },
      month: { path: 'month', limit: 6 },
      year: { path: 'month', limit: 12 },
    };
    return liskServiceGet({
      path: `/api/v1/transactions/statistics/${config[searchParams.period].path}`,
      searchParams: { limit: config[searchParams.period].limit },
      network,
    });
  },

  getConnectedPeers: (network, searchParams) =>
    liskServiceGet({
      path: '/api/v1/peers/connected/',
      searchParams,
      network,
    }),

  getLatestVotes: async (network, params = {}) => {
    const voteTransactionsRequest = {
      method: 'get.transactions',
      params: {
        limit: DEFAULT_LIMIT,
        type: transactionTypes().vote.outgoingCode,
        ...params,
      },
    };
    const voteTransactions = await liskServiceSocketGet(voteTransactionsRequest, network);

    const addresses = [
      ...voteTransactions.data.map(({ senderId }) => senderId),
      ...voteTransactions.data.reduce((accumulator, { asset: { votes } }) => ([
        ...accumulator,
        ...votes.map(v => cryptography.getAddressFromPublicKey(v.substr(1))),
      ]), []),
    ];
    const accountsRequest = [...new Set(addresses)].map(address => ({
      method: 'get.accounts',
      params: { address },
    }));

    const accounts = await liskServiceSocketGet(accountsRequest, network);

    const accountsMap = accounts.reduce((accumulator, { result: { data } }) => ({
      ...accumulator,
      [data[0].address]: data[0],
    }), {});

    const data = voteTransactions.data.map(({ asset, ...tx }) => ({
      ...tx,
      balance: accountsMap[tx.senderId] && accountsMap[tx.senderId].balance,
      votes: asset.votes.map(vote => ({
        status: vote.substr(0, 1),
        ...accountsMap[cryptography.getAddressFromPublicKey(vote.substr(1))],
      })),
    }));

    return { data, meta: voteTransactions.meta };
  },

  getAccounts: async (network, addressList) => {
    const results = await liskServiceSocketGet(addressList.map(address => ({
      method: 'get.accounts',
      params: { address },
    })));

    return results;
  },

  getVoteNames: async (network, params) => {
    const request = params.publicKeys.map(publickey => ({
      method: 'get.accounts',
      params: { publickey },
    }));
    const results = await liskServiceSocketGet(request, network);

    return results
      .map(result => result.result.data[0])
      .reduce((acc, item) => {
        acc[item.publicKey] = { ...item.delegate, account: { address: item.address } };
        return acc;
      }, {});
  },
};

export default liskServiceApi;
