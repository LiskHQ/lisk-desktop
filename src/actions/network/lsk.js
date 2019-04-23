import Lisk from 'lisk-elements';
import i18next from 'i18next';

import actionTypes from '../../constants/actions';
import { tokenMap } from '../../constants/tokens';
import networks from '../../constants/networks';
import { errorToastDisplayed } from '../toaster';

const generateAction = (data, config) => ({
  data: {
    code: data.code,
    token: tokenMap.LSK.key,
    network: config,
  },
  type: actionTypes.networkSet,
});

const pickRandomArrayItem = a => a[Math.floor(Math.random() * a.length)];

/* eslint-disable-next-line import/prefer-default-export */
export const networkSet = data =>
  async (dispatch) => {
    if (data.code === networks.customNode.code) {
      new Lisk.APIClient([data.address], {}).node.getConstants().then((response) => {
        dispatch(generateAction(data, {
          address: data.address,
          nethash: response.data.nethash,
        }));
      }).catch((error) => {
        if (error && error.message) {
          dispatch(errorToastDisplayed({ label: i18next.t(`Unable to connect to the node, Error: ${error.message}`) }));
        } else {
          dispatch(errorToastDisplayed({ label: i18next.t('Unable to connect to the node, no response from the server.') }));
        }
      });
    } else if (data.code === networks.testnet.code) {
      dispatch(generateAction(data, {
        nethash: Lisk.APIClient.constants.TESTNET_NETHASH,
        address: pickRandomArrayItem(networks.testnet.nodes),
      }));
    } else if (data.code === networks.mainnet.code) {
      dispatch(generateAction(data, {
        nethash: Lisk.APIClient.constants.MAINNET_NETHASH,
        address: pickRandomArrayItem(networks.mainnet.nodes),
      }));
    }
  };

