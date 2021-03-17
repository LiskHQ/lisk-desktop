import i18next from 'i18next';
import { toast } from 'react-toastify';
import { actionTypes } from '@constants';
import { getPrices } from '@utils/api/market';

const tickerReducer = (acc, key) => ({
  ...acc,
  [key.from]: {
    ...acc[key.from],
    [key.to]: key.rate,
  },
});

// eslint-disable-next-line import/prefer-default-export
export const pricesRetrieved = () => (dispatch, getState) => {
  const { settings: { token } } = getState();
  const activeToken = token.active;

  return getPrices()
    .then(({ data }) => {
      const priceTickerReduced = data.reduce(tickerReducer, {});
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
