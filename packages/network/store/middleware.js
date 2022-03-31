// eslint-disable-next-line no-unused-vars
import config from '@settings/configuration/settingConstants';
import { getAutoLogInData, shouldAutoLogIn } from '@common/utilities/login';
// eslint-disable-next-line no-unused-vars
import { networkConfigSet, login, settingsUpdated } from '@common/store/actions';
import actionTypes from './actionTypes';

const network = ({ dispatch, getState }) => next => async (action) => {
  next(action);
  switch (action.type) {
    case actionTypes.networkSelected: {
      dispatch(await networkConfigSet(action.data));
      break;
    }
    case actionTypes.networkConfigSet: {
      const autoLoginData = getAutoLogInData();
      if (shouldAutoLogIn(autoLoginData)) {
        // dispatch(login({ passphrase: autoLoginData[settings.keys.loginKey] }));
      }
      break;
    }
    case actionTypes.customNetworkStored:
    case actionTypes.customNetworkRemoved:
      dispatch(settingsUpdated({ storedCustomNetwork: getState().network.storedCustomNetwork }));
      break;
    default:
      break;
  }
};

export default network;
