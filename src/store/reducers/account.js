import { actionTypes, accountConfig } from '@constants';

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
      return {
        ...state,
        info: {
          ...state.info,
          ...action.data,
        },
      };
    case actionTypes.passphraseUsed:
      return { ...state, expireTime: new Date(action.data.getTime() + accountConfig.lockDuration) };
    case actionTypes.accountLoggedIn:
      return {
        ...action.data,
        expireTime: new Date(action.data.date.getTime() + accountConfig.lockDuration),
        votes: state.votes,
      };
    case actionTypes.accountLoggedOut:
      return {
        afterLogout: true,
      };
    case actionTypes.timerReset:
      return {
        ...state,
        expireTime: new Date(action.data.getTime() + accountConfig.lockDuration),
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
