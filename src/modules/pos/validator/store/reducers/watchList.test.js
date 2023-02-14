import actionTypes from '../actions/actionTypes';
import reducer from './watchList';

describe('Reducer: watchList(state, action)', () => {
  it(`return watchlist addresses in state if the ${actionTypes.watchListRetrieved} action is called`, () => {
    const retrievedWatchList = ['lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y11', 'lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y12', 'lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y13'];

    const action = { data: retrievedWatchList, type: actionTypes.watchListRetrieved };
    const updatedState = reducer(undefined, action);

    expect(updatedState).toBe(retrievedWatchList);
  });

  it(`adds address to the watchlist state if the ${actionTypes.addedToWatchList} action is called`, () => {
    const action = { data: { address: 'lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y11' }, type: actionTypes.addedToWatchList };
    const updatedState = reducer(['lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y12', 'lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y11'], action);

    expect(updatedState).toContain('lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y11');
    expect(updatedState).toContain('lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y12');
    expect(updatedState).toHaveLength(2);
  });

  it(`removes address from the watchlist state if the ${actionTypes.removedFromWatchList} action is called`, () => {
    const action = { data: { address: 'lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y12' }, type: actionTypes.removedFromWatchList };
    const updatedState = reducer(['lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y12', 'lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y11'], action);

    expect(updatedState).toContain('lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y11');
    expect(updatedState).not.toContain('lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y12');
    expect(updatedState).toHaveLength(1);
  });
});
