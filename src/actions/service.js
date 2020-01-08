import i18next from 'i18next';
import { toast } from 'react-toastify';
import actionTypes from '../constants/actions';
import serviceAPI from '../utils/api/service';

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

  serviceAPI.getPriceTicker(activeToken)
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

export const dynamicFeesRetrieved = () => (dispatch, getState) => {
  const { settings: { token } } = getState();
  const activeToken = token.active;

  serviceAPI.getDynamicFees(activeToken)
    .then(dynamicFees => dispatch({
      type: actionTypes.dynamicFeesRetrieved,
      dynamicFees,
    }))
    .catch(() => toast.error(i18next.t('Error retrieving dynamic fees.')));
};
