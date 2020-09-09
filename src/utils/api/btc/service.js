import * as popsicle from 'popsicle';

const liskServiceUrl = 'https://service.lisk.io';

// eslint-disable-next-line import/prefer-default-export
export const getPriceTicker = () => new Promise(async (resolve, reject) => {
  try {
    const response = await popsicle.get(`${liskServiceUrl}/api/v1/market/prices`)
      .use(popsicle.plugins.parse('json'));

    if (response.body.data.length) {
      resolve(response.body.data);
    } else {
      reject(response.body);
    }
  } catch (error) {
    reject(error);
  }
});
