import { toast } from 'react-toastify';

import actionTypes from '../../constants/actions';
import { tokenMap } from '../../constants/tokens';

const generateAction = (data, config) => ({
  data: {
    name: data.name,
    token: tokenMap.LSK.key,
    network: config,
  },
  type: actionTypes.networkSet,
});


// eslint-disable-next-line no-unused-vars
const network = store => next => (action) => {
  switch (action.type) {
    case actionTypes.nodeDefined:
      next(action);

      break;
    default:
      next(action);
      break;
  }
};

export default network;
