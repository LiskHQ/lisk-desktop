import Lisk2x from '@liskhq/lisk-client';
import Lisk3x from '@liskhq/lisk-client-Edge';
import store from '../../store/index';

export default function () {
  const { apiVersion } = store.getState().network.networks.LSK;
  return apiVersion === '3' ? Lisk3x : Lisk2x;
}
