// import popsicle from 'popsicle'; // doesn't work
const popsicle = require('popsicle');

const explorerUrl = 'https://explorer.lisk.io';

const explorerApi = {
  getCurrencyGrapData: step => new Promise((resolve, reject) => {
    popsicle.get(`${explorerUrl}/api/exchanges/getCandles?e=poloniex&d=${step}`)
      .use(popsicle.plugins.parse('json'))
      .then((response) => {
        const { candles } = response.body;
        resolve(candles.slice(Math.max(candles.length - 8, 1)).map(c => ({
          x: new Date(c.date),
          y: c.high,
        })));
      }).catch(reject);
  }),
};

export default explorerApi;
