import { actionTypes } from '@constants';

const appUpdates = (state = {}, action) => {
  switch (action.type) {
    case actionTypes.appUpdateAvailable:
      return {
        ...state,
        ...action.data,
      };
    default:
      return state;
  }
};

export default appUpdates;
