import { tokenMap } from '@token/fungible/consts/tokens';
import { expect } from 'chai';

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

  it('asserts true', () => {
    expect(true).to.equal(true);
  });
});
