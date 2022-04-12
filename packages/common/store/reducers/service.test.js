import actionTypes from '../actions/actionTypes';
import service, { INITIAL_STATE } from './service';

describe('reducers: service', () => {
  let state;

  beforeEach(() => {
    state = {};
  });

  it('should create the empty state initially', () => {
    const createdState = service();
    expect(createdState).toEqual(INITIAL_STATE);
  });

  it('should return updated state in case of actionTypes.pricesRetrieved', () => {
    const priceTicker = {
      BTC: {},
      LSK: { USD: 1, EUR: 1 },
    };

    const action = {
      type: actionTypes.pricesRetrieved,
      data: {
        priceTicker,
        activeToken: 'LSK',
      },
    };

    expect(service(state, action)).toEqual({
      priceTicker: {
        BTC: {},
        LSK: { EUR: 1, USD: 1 },
      },
    });
  });
});
