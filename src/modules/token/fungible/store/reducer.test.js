import { tokenMap } from '@token/fungible/consts/tokens';

describe('Reducer: token(state, action)', () => {
  let initializeState;

  beforeEach(() => {
    // eslint-disable-next-line no-unused-vars
    initializeState = {
      active: tokenMap.LSK.key,
      list: {
        [tokenMap.LSK.key]: true,
      },
    };
  });
});
