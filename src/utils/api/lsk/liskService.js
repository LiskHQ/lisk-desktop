import * as popsicle from 'popsicle';

const liskServiceUrl = 'https://service.lisk.io';

const liskServiceGet = ({
  path, transformResponse = x => x, searchParams = {},
}) => new Promise((resolve, reject) => {
  popsicle.get(`${liskServiceUrl}${path}?${new URLSearchParams(searchParams)}`)
    .use(popsicle.plugins.parse('json'))
    .then((response) => {
      resolve(transformResponse(response.body));
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
  getLastBlocks: (network, searchParams) => liskServiceGet({
    path: '/api/v1/blocks/last',
    transformResponse: response => response.data,
    searchParams: {
      limit: 20,
      ...searchParams,
    },
  }),
};

export default liskServiceApi;
