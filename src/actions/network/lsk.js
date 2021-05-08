import liskClient from 'Utils/lisk-client'; // eslint-disable-line
import Lisk from '@liskhq/lisk-client';
import i18next from 'i18next';
import { toast } from 'react-toastify';
import actionTypes from '../../constants/actions';
import { tokenMap } from '../../constants/tokens';
// import { version as AppVersion } from '../../../package.json';

// const isStaging = () => (
//   localStorage.getItem('useLiskServiceStaging')
//   || AppVersion.includes('beta')
//   || AppVersion.includes('rc')
//     ? '-staging' : '');

const getServerUrl = (nodeUrl, nethash) => {
  if (nethash === Lisk.constants.MAINNET_NETHASH) {
    return 'https://mainnet-service.lisk.io';
  }
  if (nethash === Lisk.constants.TESTNET_NETHASH) {
    return 'https://testnet-service.lisk.io';
  }
  if (/liskdev.net:\d{2,4}$/.test(nodeUrl)) {
    return nodeUrl.replace(/:\d{2,4}/, ':9901');
  }
  if (/\.(liskdev.net|lisk.io)$/.test(nodeUrl)) {
    return nodeUrl.replace(/\.(liskdev.net|lisk.io)$/, $1 => `-service${$1}`);
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

export const getConnectionErrorMessage = error => (
  error && error.message
    ? i18next.t(`Unable to connect to the node, Error: ${error.message}`)
    : i18next.t('Unable to connect to the node, no response from the server.')
);

const getNetworkInfo = async (nodeUrl, apiVersion) => (
  new Promise(async (resolve, reject) => {
    const Client = liskClient(apiVersion);
    new Client.APIClient([nodeUrl], {}).node.getConstants().then((response) => {
      resolve(response.data);
    }).catch((error) => {
      reject(getConnectionErrorMessage(error));
    });
  })
);

export const networkSet = data => async (dispatch, getState) => {
  const state = getState();
  const apiVersion = (state.network
    && state.network.networks
    && state.network.networks.LSK
    && state.network.networks.LSK.apiVersion) || '2';
  const nodeUrl = data.network.address || data.network.nodes[0];
  await getNetworkInfo(nodeUrl, apiVersion).then(({ nethash, version, networkId }) => {
    const network = {
      nodeUrl,
      custom: data.network.custom,
      code: data.network.code,
      apiVersion: version.substring(0, 1),
      nethash,
      networkIdentifier: networkId,
    };
    dispatch(generateAction(data, network));
    dispatch({
      data: getServerUrl(nodeUrl, nethash),
      type: actionTypes.serviceUrlSet,
    });
  }).catch((error) => {
    dispatch(generateAction(data, {
      nodeUrl: data.network.address,
      custom: data.network.custom,
      code: data.network.code,
    }));
    toast.error(error);
  });
};
