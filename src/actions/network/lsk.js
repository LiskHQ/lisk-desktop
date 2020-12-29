import { getNetworkConfig } from '../../utils/api/network';
import actionTypes from '../../constants/actions';
import { tokenMap } from '../../constants/tokens';

// eslint-disable-next-line import/prefer-default-export
export const lskNetworkSet = data => (dispatch) => {
  getNetworkConfig(data, tokenMap.LSK.key)
    .then((config) => {
      dispatch({
        type: actionTypes.networkSet,
        data: {
          token: tokenMap.LSK.key,
          config,
        },
      });
    });
};
