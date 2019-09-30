import * as popsicle from 'popsicle';

const liskServiceUrl = 'https://service.lisk.io';

const liskServiceGet = ({
  path, transformResponse = x => x,
}) => new Promise((resolve, reject) => {
  popsicle.get(`${liskServiceUrl}${path}`)
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
  getLastBlocks: () => liskServiceGet({
    path: '/api/getLastBlocks',
    transformResponse: response => response.blocks,
  }),
};

export default liskServiceApi;
