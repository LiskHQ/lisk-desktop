import { tokenMap } from '@token/fungible/consts/tokens';

export const initialState = {
  active: tokenMap.LSK.key,
  list: {
    [tokenMap.LSK.key]: true,
  },
};

const token = (state = initialState) => state;

export default token;
