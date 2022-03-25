import { actionTypes } from '@common/configuration';
import * as marketApi from '@common/utilities/api/market';
import { initialState as settings } from '@settings/store/reducer';
import prices from '../../../../tests/constants/prices';
import { pricesRetrieved } from './service';

describe('actions: service', () => {
  const getState = () => ({
    settings: {
      token: {
        active: 'LSK',
      },
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
          activeToken: settings.token.active,
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
