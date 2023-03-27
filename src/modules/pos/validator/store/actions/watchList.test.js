import actionTypes from './actionTypes';
import { addedToWatchList, removedFromWatchList, watchListRetrieved } from './watchList';

describe('actions: watchList', () => {
  const data = {
    address: 'lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y11',
  };

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should create an action to add a validator to the watchlist', () => {
    const expectedAction = {
      data,
      type: actionTypes.addedToWatchList,
    };
    expect(addedToWatchList(data)).toEqual(expectedAction);
  });

  it('should create an action to remove a validator from the watchlist', () => {
    const expectedAction = {
      data,
      type: actionTypes.removedFromWatchList,
    };
    expect(removedFromWatchList(data)).toEqual(expectedAction);
  });

  it('should create an action to retrieve the watchlist', () => {
    const retrievedWatchList = [
      'lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y11',
      'lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y12',
      'lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y13',
    ];
    const dispatch = jest.fn();
    window.localStorage.getItem = jest.fn(() => JSON.stringify(retrievedWatchList));
    const expectedAction = {
      data: retrievedWatchList,
      type: actionTypes.watchListRetrieved,
    };

    watchListRetrieved()(dispatch);
    expect(dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should create an action  with an empty array if no no watchlist is found in localStorage', () => {
    const dispatch = jest.fn();
    window.localStorage.getItem = jest.fn(() => null);
    const expectedAction = {
      data: [],
      type: actionTypes.watchListRetrieved,
    };

    watchListRetrieved()(dispatch);
    expect(dispatch).toHaveBeenCalledWith(expectedAction);
  });
});
