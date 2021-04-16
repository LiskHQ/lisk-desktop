import { reducer, actionTypes, getInitialState } from './reducer';


describe('useTransactionFeeCalculation.reducer', () => {
  it('returns some initial state', () => {
    const initialState = getInitialState({ balance: 0 });
    expect(initialState).toBeDefined();
  });

  it(`updates the state when called with ${actionTypes.setFee}`, () => {
    const state = {};
    const newState = reducer(state, { type: actionTypes.setFee, payload: { response: 1 } });
    expect(newState).toStrictEqual({ ...state, fee: 1 });
  });

  it(`updates the state when called with ${actionTypes.setMinFee}`, () => {
    const state = {};
    const newState = reducer(state, { type: actionTypes.setMinFee, payload: { response: 1 } });
    expect(newState).toStrictEqual({ ...state, minFee: 1 });
  });

  it(`updates the state when called with ${actionTypes.setMaxAmount}`, () => {
    const state = { feedback: '', error: false, value: 0 };
    const newState = reducer(state, {
      type: actionTypes.setMaxAmount,
      payload: { token: 'LSK', response: 1, account: { token: { balance: 200000000 } } },
    });
    expect(newState).toStrictEqual({ ...state, value: 195000000 });
  });
});
