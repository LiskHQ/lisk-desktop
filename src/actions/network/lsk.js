import Lisk from 'lisk-elements';
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

const pickRandomArrayItem = a => a[Math.floor(Math.random() * a.length)];

/* eslint-disable-next-line import/prefer-default-export */
export const networkSet = data =>
  async (dispatch) => {
    if (data.name === networks.customNode.name) {
      new Lisk.APIClient([data.nodeUrl], {}).node.getConstants().then((response) => {
        dispatch(generateAction(data, {
          nodeUrl: data.nodeUrl,
          nethash: response.data.nethash,
        }));
      }).catch((error) => {
        if (error && error.message) {
          dispatch(errorToastDisplayed({ label: i18next.t(`Unable to connect to the node, Error: ${error.message}`) }));
        } else {
          dispatch(errorToastDisplayed({ label: i18next.t('Unable to connect to the node, no response from the server.') }));
        }
      });
    } else if (data.name === networks.testnet.name) {
      dispatch(generateAction(data, {
        nethash: Lisk.APIClient.constants.TESTNET_NETHASH,
        nodeUrl: pickRandomArrayItem(networks.testnet.nodes),
      }));
    } else if (data.name === networks.mainnet.name) {
      dispatch(generateAction(data, {
        nethash: Lisk.APIClient.constants.MAINNET_NETHASH,
        nodeUrl: pickRandomArrayItem(networks.mainnet.nodes),
      }));
    }
  };

