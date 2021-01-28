import actionTypes from '../constants/actions';
import { addedToWatchList, removedFromWatchList, watchListRetrieved } from './watchList';

describe('actions: watchList', () => {
  const data = {
    address: '1L',
  };

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should create an action to add a delegate to the watchlist', () => {
    const expectedAction = {
      data,
      type: actionTypes.addedToWatchList,
    };
    expect(addedToWatchList(data)).toEqual(expectedAction);
  });

  it('should create an action to remove a delegate from the watchlist', () => {
    const expectedAction = {
      data,
      type: actionTypes.removedFromWatchList,
    };
    expect(removedFromWatchList(data)).toEqual(expectedAction);
  });

  it('should create an action to retrieve the watchlist', () => {
    const retrievedWatchList = ['1L', '2L', '3L'];
    const dispatch = jest.fn();
    window.localStorage.getItem = jest.fn(() => JSON.stringify(retrievedWatchList));
    const expectedAction = {
      data: retrievedWatchList,
      type: actionTypes.watchListRetrieved,
    };

    watchListRetrieved()(dispatch);
    expect(dispatch).toHaveBeenCalledWith(expectedAction);
  });
});
