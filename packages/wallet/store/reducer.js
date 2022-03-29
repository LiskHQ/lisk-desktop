import accountConstants from '@wallet/configuration/account';
import actionTypes from './actionTypes';

/**
 *
 * @param {Array} state
 * @param {Object} action
 */
// eslint-disable-next-line complexity
const account = (state = {}, action) => {
  switch (action.type) {
    case actionTypes.accountUpdated:
      return {
        ...state,
        info: {
          ...state.info,
          ...action.data,
        },
      };
    case actionTypes.accountLoggedIn:
      return {
        ...action.data,
        expireTime: new Date(action.data.date.getTime() + accountConstants.lockDuration),
        votes: state.votes,
      };
    case actionTypes.accountLoggedOut:
      return {
        afterLogout: true,
      };
    case actionTypes.timerReset:
      return {
        ...state,
        expireTime: new Date(action.data.getTime() + accountConstants.lockDuration),
      };
    case actionTypes.accountLoading:
      return {
        loading: true,
      };
    case actionTypes.secondPassphraseStored:
      return {
        ...state,
        secondPassphrase: action.data,
      };
    case actionTypes.secondPassphraseRemoved:
      return {
        ...state,
        secondPassphrase: null,
      };
    default:
      return state;
  }
};

export default account;
