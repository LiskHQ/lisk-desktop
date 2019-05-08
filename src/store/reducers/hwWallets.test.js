import hwWallets from './hwWallets';
import actionTypes from '../../constants/actions';

describe('Reducer: hwWallets(state, action)', () => {
  let state;

  beforeEach(() => {
    state = {
      devices: [],
    };
  });

  it('should return current state if not invalid action type', () => {
    const action = {
      type: 'invalid action type',
      data: [],
    };
    const currentState = hwWallets(state, action);
    expect(currentState).toEqual({ ...state });
  });

  it('Should return new deviceList if action.type === devicesListUpdate', () => {
    const action = {
      type: actionTypes.deviceListUpdated,
      data: [{ model: 'Trezor', deviceId: 1 }, { model: 'Ledger', deviceId: 2 }],
    };
    const updatedState = hwWallets(state, action);
    expect(updatedState).toEqual({ devices: action.data });
  });
});
