import accountConstants from '@wallet/configuration/constants';
import actionTypes from '../actionTypes';

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
