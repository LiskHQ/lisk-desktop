import i18next from 'i18next';
import { toast } from 'react-toastify';
import actionTypes from '../constants/actions';
import { getPrices } from '../utils/api/market';

// eslint-disable-next-line import/prefer-default-export
export const pricesRetrieved = () => (dispatch, getState) => {
  const { settings: { token } } = getState();
  const activeToken = token.active;
  const tickerReducer = (acc, key) => ({
    ...acc,
    [key.from]: {
      ...acc[key.from],
      [key.to]: key.rate,
    },
  });

  getPrices()
    .then((priceTicker) => {
      const priceTickerReduced = priceTicker.reduce(tickerReducer, {});
      dispatch({
        type: actionTypes.pricesRetrieved,
        data: {
          priceTicker: priceTickerReduced,
          activeToken,
        },
      });
    })
    .catch(() => toast.error(i18next.t('Error retrieving conversion rates.')));
};
