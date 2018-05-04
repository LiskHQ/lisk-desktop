// import popsicle from 'popsicle'; // doesn't work
const popsicle = require('popsicle');

const liskServiceUrl = 'https://service.lisk.io';

const liskServiceApi = {
  getCurrencyGraphData: ({ span }) => new Promise((resolve, reject) => {
    popsicle.get(`${liskServiceUrl}/api/exchanges/getCandles?e=bittrex&d=${span}`)
      .use(popsicle.plugins.parse('json'))
      .then((response) => {
        if (response.body && response.body.candles && response.body.candles.length > 0) {
          resolve(response.body);
        } else {
          reject(response.body);
        }
      }).catch(reject);
  }),
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
};

export default liskServiceApi;
