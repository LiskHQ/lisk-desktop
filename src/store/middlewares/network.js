import Lisk from '@liskhq/lisk-client';
import { toast } from 'react-toastify';

import actionTypes from '../../constants/actions';
import { tokenMap } from '../../constants/tokens';
import { getConnectionErrorMessage } from '../../utils/getNetwork';

const getServerUrl = (nodeUrl, nethash) => {
  if (nethash === Lisk.constants.MAINNET_NETHASH) {
    return {
      serviceUrl: 'https://mainnet-service.lisk.io',
      cloudUrl: 'https://cloud.lisk.io',
    };
  }
  if (nethash === Lisk.constants.TESTNET_NETHASH) {
    return {
      serviceUrl: 'https://testnet-service.lisk.io',
      cloudUrl: 'https://cloud.lisk.io',
    };
  }
  if (/(localhost|liskdev.net):\d{2,4}$/.test(nodeUrl)) {
    return {
      serviceUrl: nodeUrl.replace(/:\d{2,4}/, ':9901'),
      cloudUrl: 'https://cloud.lisk.io',
    };
  }
  if (/\.(liskdev.net|lisk.io)$/.test(nodeUrl)) {
    return {
      serviceUrl: nodeUrl.replace(/\.(liskdev.net|lisk.io)$/, $1 => `-service${$1}`),
      cloudUrl: 'https://cloud.lisk.io',
    };
  }
  return 'unavailable';
};

const generateAction = (data, config) => ({
  data: {
    name: data.name,
    token: tokenMap.LSK.key,
    network: config,
  },
  type: actionTypes.networkSet,
});

const getNetworkInfo = async nodeUrl => (
  new Promise(async (resolve, reject) => {
    new Lisk.APIClient([nodeUrl], {}).node.getConstants().then((response) => {
      resolve(response.data);
    }).catch((error) => {
      reject(getConnectionErrorMessage(error));
    });
  })
);

const network = store => next => (action) => {
  const { dispatch } = store;
  switch (action.type) {
    case actionTypes.nodeDefined:
      next(action);
      getNetworkInfo(action.data.nodeUrl).then(({ nethash, networkId }) => {
        const networkConfig = {
          nodeUrl: action.data.nodeUrl,
          custom: action.data.network.custom,
          code: action.data.network.code,
          nethash,
          networkIdentifier: networkId,
        };
        dispatch(generateAction(action.data, networkConfig));
        dispatch({
          data: getServerUrl(action.data.nodeUrl, nethash),
          type: actionTypes.serviceUrlSet,
        });
      }).catch((error) => {
        dispatch(generateAction(action.data, {
          nodeUrl: action.data.network.address,
          custom: action.data.network.custom,
          code: action.data.network.code,
        }));
        toast.error(error);
      });

      break;
    default:
      next(action);
      break;
  }
};

export default network;
