import { reducer, actionTypes, getInitialState } from './reducer';

describe('useTransactionFeeCalculation.reducer', () => {
  it('returns some initial state', () => {
    const initialState = getInitialState({ balance: 0 });
    expect(initialState).toBeDefined();
  });

  it(`updates the state when called with ${actionTypes.setFee}`, () => {
    const state = { fee: { feedback: '', error: false, value: 0 } };
    const response = { ...state.fee, value: 1 };
    const newState = reducer(state, { type: actionTypes.setFee, payload: { response } });
    const expectedState = { fee: { ...state.fee, value: 1 } };
    expect(newState).toStrictEqual(expectedState);
  });

  it(`updates the state when called with ${actionTypes.setMinFee}`, () => {
    const state = { minFee: { feedback: '', error: false, value: 0 } };
    const response = { ...state.minFee, value: 1 };
    const newState = reducer(state, { type: actionTypes.setMinFee, payload: { response } });
    const expectedState = { minFee: { ...state.minFee, value: 1 } };

    expect(newState).toStrictEqual(expectedState);
  });

  it(`updates the state when called with ${actionTypes.setMaxAmount}`, () => {
    const state = { maxAmount: { feedback: '', error: false, value: 0 } };
    const newState = reducer(state, {
      type: actionTypes.setMaxAmount,
      payload: { token: 'LSK', response: 1, account: { token: { balance: 200000000 } } },
    });
    const expectedState = { maxAmount: { ...state.maxAmount, value: 195000000 } };

    expect(newState).toStrictEqual(expectedState);
  });
});
