import searchParams from './searchParams';
import actionTypes from '../../constants/actions';

describe('Reducer: searchParams(state, action)', () => {
  it('should return state object with passed searchParams setup if action is modalParamChanged', () => {
    const state = {
      modal: '',
    };
    const action = {
      type: actionTypes.modalParamChanged,
      data: { modal: 'some new modal' },
    };

    const newState = {
      modal: action.data.modal,
    };
    const changedState = searchParams(state, action);
    expect(changedState).toEqual(newState);
  });

  it('gets the initial state from the url search params', () => {
    global.window = Object.create(window);
    Object.defineProperty(window, 'location', {
      value: {
        search: '?modal=etc',
      },
    });

    const action = {
      type: 'unknown action',
    };

    const expected = {
      modal: 'etc',
    };
    const initialState = searchParams(undefined, action);
    expect(initialState).toEqual(expected);
  });
});
