import actionTypes from '../../constants/actions';
import { tokenMap } from '../../constants/tokens';


/* eslint-disable-next-line import/prefer-default-export */
export const networkSet = data => ({
  data: {
    code: data.code,
    token: tokenMap.BTC.key,
    network: {},
  },
  type: actionTypes.networkSet,
});
