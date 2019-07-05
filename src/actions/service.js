import i18next from 'i18next';
import actionTypes from '../constants/actions';
import serviceAPI from '../utils/api/service';
import { errorToastDisplayed } from './toaster';

export const pricesRetrieved = () => (dispatch, getState) => {
  const { settings: { token } } = getState();
  const activeToken = token.active;

  serviceAPI.getPriceTicker(activeToken)
    .then(priceTicker => dispatch({
      type: actionTypes.pricesRetrieved,
      data: {
        priceTicker,
        activeToken,
      },
    }))
    .catch(() => dispatch(errorToastDisplayed(i18next.t('Error retrieving convertion rates.'))));
};

export const dynamicFeesRetrieved = () => (dispatch, getState) => {
  const { settings: { token } } = getState();
  const activeToken = token.active;

  serviceAPI.getDynamicFees(activeToken)
    .then(dynamicFees => dispatch({
      type: actionTypes.dynamicFeesRetrieved,
      dynamicFees,
    }))
    .catch(() => dispatch(errorToastDisplayed(i18next.t('Error retrieving dynamic fees.'))));
};
