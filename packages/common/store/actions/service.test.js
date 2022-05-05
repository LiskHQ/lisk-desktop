import * as marketApi from 'src/modules/common/api';
import { initialState as token } from '@token/fungible/store/reducer';
import prices from '@tests/constants/prices';
import actionTypes from './actionTypes';
import { pricesRetrieved } from './service';

describe('actions: service', () => {
  const getState = () => ({
    token: {
      active: 'LSK',
    },
  });
  const dispatch = jest.fn();
  marketApi.getPrices = jest.fn();
  marketApi.getDynamicFees = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
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
      marketApi.getPrices.mockResolvedValueOnce({ data: prices });

      await pricesRetrieved()(dispatch, getState);

      expect(dispatch).toHaveBeenCalledWith({
        type: actionTypes.pricesRetrieved,
        data: {
          priceTicker: tickers,
          activeToken: token.active,
        },
      });
    });

    it('should handle rejections', async () => {
      marketApi.getPrices.mockRejectedValueOnce('Error');
      await pricesRetrieved()(dispatch, getState);
      expect(dispatch).not.toHaveBeenCalled();
    });
  });
});
