// import popsicle from 'popsicle'; // doesn't work
const popsicle = require('popsicle');

const explorerUrl = 'https://explorer.lisk.io';

const explorerApi = {
  getCurrencyGrapData: ({ span }) => new Promise((resolve, reject) => {
    popsicle.get(`${explorerUrl}/api/exchanges/getCandles?e=poloniex&d=${span}`)
      .use(popsicle.plugins.parse('json'))
      .then((response) => {
        if (response.body && response.body.candles && response.body.candles.length > 0) {
          resolve(response.body);
        } else {
          reject(response.body);
        }
      }).catch(reject);
  }),
};

export default explorerApi;
