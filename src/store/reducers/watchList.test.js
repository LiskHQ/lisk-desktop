import actionTypes from 'constants';
import reducer from './watchList';

describe('Reducer: watchList(state, action)', () => {
  it(`return watchlist addresses in state if the ${actionTypes.watchListRetrieved} action is called`, () => {
    const retrievedWatchList = ['1L', '2L', '3L'];

    const action = { data: retrievedWatchList, type: actionTypes.watchListRetrieved };
    const updatedState = reducer(undefined, action);

    expect(updatedState).toBe(retrievedWatchList);
  });

  it(`adds address to the watchlist state if the ${actionTypes.addedToWatchList} action is called`, () => {
    const action = { data: { address: '1L' }, type: actionTypes.addedToWatchList };
    const updatedState = reducer(['2L', '1L'], action);

    expect(updatedState).toContain('1L');
    expect(updatedState).toContain('2L');
    expect(updatedState).toHaveLength(2);
  });

  it(`removes address from the watchlist state if the ${actionTypes.removedFromWatchList} action is called`, () => {
    const action = { data: { address: '2L' }, type: actionTypes.removedFromWatchList };
    const updatedState = reducer(['2L', '1L'], action);

    expect(updatedState).toContain('1L');
    expect(updatedState).not.toContain('2L');
    expect(updatedState).toHaveLength(1);
  });
});
