import { tokenKeys } from '@token/fungible/consts/tokens';
import actionTypes from '../actions/actionTypes';

export const INITIAL_STATE = {
  priceTicker: tokenKeys.reduce((info, tokenKey) => ({
    ...info,
    [tokenKey]: {},
  }), {}),
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
    default:
      return state;
  }
};

export default service;
