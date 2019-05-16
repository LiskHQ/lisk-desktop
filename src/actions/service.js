import i18next from 'i18next';
import actionTypes from '../constants/actions';
import serviceAPI from '../utils/api/service';
import { errorToastDisplayed } from './toaster';
import { tokenMap } from '../constants/tokens';

export const pricesRetrieved = () => (dispatch, getState) => {
  const { settings: { token } } = getState();

  serviceAPI.getPriceTicker((token && token.active) || tokenMap.LSK.key)
    .then(priceTicker => dispatch({
      type: actionTypes.pricesRetrieved,
      data: {
        priceTicker,
        activeToken: token ? token.active : tokenMap.LSK.key,
      },
    }))
    .catch(() => dispatch(errorToastDisplayed(i18next.t('Error retrieving convertion rates.'))));
};

export const dynamicFeesRetrieved = () => (dispatch, getState) => {
  const { settings: { token } } = getState();

  serviceAPI.getDynamicFees((token && token.active) || tokenMap.LSK.key)
    .then(dynamicFees => dispatch({
      type: actionTypes.dynamicFeesRetrieved,
      dynamicFees,
    }))
    .catch(() => dispatch(errorToastDisplayed(i18next.t('Error retrieving dynamic fees.'))));
};
