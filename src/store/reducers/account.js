import actionTypes from '../../constants/actions';
import accountConfig from '../../constants/account';

/**
 *
 * @param {Array} state
 * @param {Object} action
 */
// eslint-disable-next-line complexity
const account = (state = {}, action) => {
  switch (action.type) {
    case actionTypes.removePassphrase:
      return { ...state, passphrase: null, expireTime: 0 };
    case actionTypes.accountUpdated:
      return action.data.token ? {
        ...state,
        info: {
          ...(state.info || {}),
          [action.data.token]: {
            ...((state.info && state.info[action.data.token]) || {}),
            ...action.data,
          },
        },
      } : {
        ...state,
        ...action.data,
      };
    case actionTypes.passphraseUsed:
      return { ...state, expireTime: new Date(action.data.getTime() + accountConfig.lockDuration) };
    case actionTypes.accountLoggedIn:
      return {
        ...action.data,
        votes: state.votes,
      };
    case actionTypes.accountLoggedOut:
      return {
        afterLogout: true,
      };
    case actionTypes.accountLoading:
      return {
        loading: true,
      };
    default:
      return state;
  }
};

export default account;
