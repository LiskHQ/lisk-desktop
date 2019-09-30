import * as popsicle from 'popsicle';

const liskServiceUrl = 'https://service.lisk.io';

const liskServiceGet = ({ path }) => new Promise((resolve, reject) => {
  popsicle.get(`${liskServiceUrl}${path}`)
    .use(popsicle.plugins.parse('json'))
    .then((response) => {
      resolve(response.body);
    }).catch((error) => {
      reject(error);
    });
});

const liskServiceApi = {
  getPriceTicker: async () => {
    const response = await liskServiceGet({ path: '/api/v1/market/prices' });
    if (response && response.data && response.data.length) {
      return response.data;
    }
    throw new Error(response);
  },
  getNewsFeed: () => liskServiceGet({ path: '/api/newsfeed' }),
};

export default liskServiceApi;
