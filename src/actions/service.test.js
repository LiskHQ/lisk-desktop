import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import { pricesRetrieved } from './service';
import { initialState as settings } from '../store/reducers/settings';
import actionTypes from '../constants/actions';
import prices from '../../test/constants/prices';
import serviceAPI from '../utils/api/service';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('actions: service', () => {
  let store;

  beforeEach(() => {
    serviceAPI.getPriceTicker = jest.fn();
    serviceAPI.getDynamicFees = jest.fn();
    store = mockStore({ settings });
  });

  describe('pricesRetrieved', () => {
    it('should dispatch pricesRetrieved action with given data', async () => {
      const tickers = {
        LSK: {
          USD: prices.find(({ to }) => to === 'USD').rate,
          EUR: prices.find(({ to }) => to === 'EUR').rate,
          CHF: prices.find(({ to }) => to === 'CHF').rate,
        },
      };
      serviceAPI.getPriceTicker.mockResolvedValueOnce(prices);

      await store.dispatch(pricesRetrieved());

      expect(store.getActions()).toEqual([{
        type: actionTypes.pricesRetrieved,
        data: {
          priceTicker: tickers,
          activeToken: settings.token.active,
        },
      }]);
    });

    it('should handle rejections', async () => {
      serviceAPI.getPriceTicker.mockRejectedValueOnce('Error');
      await store.dispatch(pricesRetrieved());
      expect(store.getActions()).toEqual([]);
    });
  });
});
