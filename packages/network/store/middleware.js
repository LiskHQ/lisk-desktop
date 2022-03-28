import { actionTypes } from '@common/configuration';
import settings from '@settings/configuration/settings';
import { getAutoLogInData, shouldAutoLogIn } from '@common/utilities/login';
import { networkConfigSet, login, settingsUpdated } from '@common/store/actions';

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
        dispatch(login({ passphrase: autoLoginData[settings.keys.loginKey] }));
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
