import * as popsicle from 'popsicle';

import networks from '../../../constants/networks';
import getBtcConfig from './config';

// eslint-disable-next-line import/prefer-default-export
export const getAPIClient = (network) => {
  // TODO update getBtcConfig to accept network name instead of code
  const config = getBtcConfig(network.name === networks.mainnet.name ?
    networks.mainnet.code :
    networks.testnet.code);
  return {
    get: path => (new Promise(async (resolve, reject) => {
      try {
        const response = await popsicle.get(`${config.url}/${path}`, config.requestOptions).use(popsicle.plugins.parse('json'));
        if (response.status === 200) {
          resolve(response);
        } else {
          reject(response);
        }
      } catch (error) {
        reject(error);
      }
    })),
    post: (path, body) => (
      popsicle.post(`${config.url}/${path}`, {
        body: JSON.stringify(body),
        ...config.requestOptions,
      })
    ),
    config,
  };
};
