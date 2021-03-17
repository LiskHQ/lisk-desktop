import { actionTypes, settings } from '@constants';
import { getAutoLogInData, shouldAutoLogIn } from '@utils/login';
import { networkConfigSet, login } from '@actions';

const network = ({ dispatch }) => next => async (action) => {
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
    default:
      break;
  }
};

export default network;
