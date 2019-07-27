import Lisk from '@liskhq/lisk-client';
import i18next from 'i18next';

import actionTypes from '../../constants/actions';
import { tokenMap } from '../../constants/tokens';
import networks from '../../constants/networks';
import { errorToastDisplayed } from '../toaster';

const generateAction = (data, config) => ({
  data: {
    name: data.name,
    token: tokenMap.LSK.key,
    network: config,
  },
  type: actionTypes.networkSet,
});

export const getConnectionErrorMessage = error => (
  error && error.message
    ? i18next.t(`Unable to connect to the node, Error: ${error.message}`)
    : i18next.t('Unable to connect to the node, no response from the server.')
);

const getNethash = async nodeUrl => (
  new Promise(async (resolve, reject) => {
    new Lisk.APIClient([nodeUrl], {}).node.getConstants().then((response) => {
      resolve(response.data.nethash);
    }).catch((error) => {
      reject(getConnectionErrorMessage(error));
    });
  })
);

/* eslint-disable-next-line import/prefer-default-export */
export const networkSet = data =>
  async (dispatch) => {
    if (data.network.name === networks.customNode.name) {
      dispatch(generateAction(data, {
        nodeUrl: data.network.address,
        nethash: '',
      }));
      await getNethash(data.network.address).then((nethash) => {
        dispatch(generateAction(data, {
          nodeUrl: data.network.address,
          nethash,
        }));
      }).catch((error) => {
        dispatch(errorToastDisplayed({ label: error }));
      });
    } else if (data.network.name === networks.testnet.name || data.network.name === networks.mainnet.name) {
      dispatch(generateAction(data, data.network));
    }
  };
