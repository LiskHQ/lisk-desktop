import actionTypes from '../../constants/actions';
import { tokenMap } from '../../constants/tokens';


/* eslint-disable-next-line import/prefer-default-export */
export const networkSet = data => ({
  data: {
    name: data.name,
    token: tokenMap.BTC.key,
    network: {},
  },
  type: actionTypes.networkSet,
});
