import Lisk2x from '@liskhq/lisk-client-old';
import Lisk3x from '@liskhq/lisk-client';
import store from '../../store/index';

export default function () {
  const networkConfig = store.getState().network.networks.LSK;
  let apiVersion = '2';
  if (networkConfig) {
    apiVersion = networkConfig.apiVersion;
  }
  return apiVersion === '3' ? Lisk3x : Lisk2x;
}
