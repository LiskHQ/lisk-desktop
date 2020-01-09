import actionTypes from '../../constants/actions';
import { tokenKeys } from '../../constants/tokens';

export const INITIAL_STATE = {
  priceTicker: tokenKeys.reduce((info, tokenKey) => ({
    ...info,
    [tokenKey]: {},
  }), {}),
  dynamicFees: {},
};

const service = (state = INITIAL_STATE, action = {}) => {
  switch (action.type) {
    case actionTypes.pricesRetrieved:
      return ({
        ...state,
        priceTicker: {
          ...state.priceTicker,
          ...action.data.priceTicker,
        },
      });

    case actionTypes.dynamicFeesRetrieved:
      return ({
        ...state,
        dynamicFees: action.dynamicFees,
      });
    default:
      return state;
  }
};

export default service;
