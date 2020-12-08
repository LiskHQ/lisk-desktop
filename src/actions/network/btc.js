import actionTypes from '../../constants/actions';
import { getNetworkConfig } from '../../utils/api/network';
import { tokenMap } from '../../constants/tokens';

// eslint-disable-next-line import/prefer-default-export
export const btcNetworkSet = data => (dispatch) => {
  getNetworkConfig(data, tokenMap.BTC.key)
    .then((config) => {
      dispatch({
        type: actionTypes.networkSet,
        data: {
          token: tokenMap.BTC.key,
          config,
        },
      });
    });
};
