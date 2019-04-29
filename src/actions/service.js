import actionTypes from '../constants/actions';
import serviceAPI from '../utils/api/service';

export const pricesRetrieved = () => (dispatch, getState) => {
  const { settings: { token } } = getState();

  serviceAPI.getPriceTicker(token.active)
    .then(priceTicker => dispatch({
      type: actionTypes.pricesRetrieved,
      data: {
        priceTicker,
        activeToken: token.active,
      },
    }))
    // eslint-disable-next-line no-console
    .catch(err => console.log(err)); // TODO: DISCUSS & HANDLE THIS!
};

export const dynamicFeesRetrieved = () => (dispatch, getState) => {
  const { settings: { token } } = getState();

  serviceAPI.getDynamicFees(token.active)
    .then(dynamicFees => dispatch({
      type: actionTypes.dynamicFeesRetrieved,
      dynamicFees,
    }))
    // eslint-disable-next-line no-console
    .catch(err => console.log(err)); // TODO: DISCUSS & HANDLE THIS!
};
