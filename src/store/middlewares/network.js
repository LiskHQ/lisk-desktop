import { actionsType, settings } from 'constants';
import { networkConfigSet } from '../../actions/network';
import { getAutoLogInData, shouldAutoLogIn } from '../../utils/login';
import { login } from '../../actions/account';

const network = ({ dispatch }) => next => async (action) => {
  next(action);
  switch (action.type) {
    case actionsType.networkSelected: {
      dispatch(await networkConfigSet(action.data));
      break;
    }
    case actionsType.networkConfigSet: {
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
