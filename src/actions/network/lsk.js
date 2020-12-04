import networks from '../../constants/networks';
import actionTypes from '../../constants/actions';

// eslint-disable-next-line import/prefer-default-export
export const lskNetworkSet = data => (dispatch) => {
  const nodeUrl = data.name === networks.customNode.name
    ? data.network.address
    : networks[data.name.toLowerCase()].nodes[0];
  dispatch({
    type: actionTypes.nodeDefined,
    data: {
      token: 'LSK',
      ...data,
      nodeUrl,
    },
  });
};
