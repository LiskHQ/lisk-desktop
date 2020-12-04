import actionTypes from '../../constants/actions';
import { getNetworkConfig } from '../../utils/api/network';

// eslint-disable-next-line import/prefer-default-export
export const btcNetworkSet = data => (dispatch) => {
  dispatch({
    type: actionTypes.nodeDefined,
    data: {
      token: 'BTC',
      ...data,
      ...getNetworkConfig(data),
    },
  });
};
