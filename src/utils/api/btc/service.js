import * as popsicle from 'popsicle';
import getBtcConfig from './config';

const liskServiceUrl = 'https://service.lisk.io';

export const getPriceTicker = () => new Promise(async (resolve, reject) => {
  try {
    const response = await popsicle.get(`${liskServiceUrl}/api/v1/market/prices`)
      .use(popsicle.plugins.parse('json'));

    if (response) {
      resolve(response.body.data.length);
    } else {
      reject(response.body.data);
    }
  } catch (error) {
    reject(error);
  }
});

export const getDynamicFees = () => new Promise(async (resolve, reject) => {
  try {
    const config = getBtcConfig(0);
    const response = await popsicle.get(config.minerFeesURL)
      .use(popsicle.plugins.parse('json'));
    const json = response.body;

    if (response) {
      resolve({
        Low: json.hourFee,
        Medium: json.halfHourFee,
        High: json.fastestFee,
      });
    } else {
      reject(json);
    }
  } catch (error) {
    reject(error);
  }
});
