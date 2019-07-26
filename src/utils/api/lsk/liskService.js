// import popsicle from 'popsicle'; // doesn't work
const popsicle = require('popsicle');

const liskServiceUrl = 'https://service.lisk.io';

const liskServiceApi = {
  getPriceTicker: () => new Promise((resolve, reject) => {
    popsicle.get(`${liskServiceUrl}/api/getPriceTicker`)
      .use(popsicle.plugins.parse('json'))
      .then((response) => {
        if (response.body.success) {
          resolve(response.body.tickers);
        } else {
          reject(response.body);
        }
      }).catch(reject);
  }),
  getNewsFeed: () => new Promise((resolve, reject) => {
    popsicle.get(`${liskServiceUrl}/api/newsfeed`)
      .use(popsicle.plugins.parse('json'))
      .then((response) => {
        if (response.body) {
          resolve(response.body);
        } else {
          reject(response.body);
        }
      }).catch(reject);
  }),
};

export default liskServiceApi;
