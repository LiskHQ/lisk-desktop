import actionTypes from '../constants/actions';
import liskServiceApi from '../../src/utils/api/liskService';

export const addDataToCurrencyGraph = data => ({
  type: actionTypes.addDataToCurrencyGraph,
  data,
});

export const addErrorToCurrencyGraph = data => ({
  type: actionTypes.addErrorToCurrencyGraph,
  data,
});

export const clearDataOfCurrencyGraph = data => ({
  type: actionTypes.clearDataOfCurrencyGraph,
  data,
});

export const getCurrencyGraphData = step => (dispatch) => {
  dispatch(clearDataOfCurrencyGraph());
  liskServiceApi.getCurrencyGraphData(step).then((response) => {
    dispatch(addDataToCurrencyGraph({ response, step }));
  }).catch((error) => {
    dispatch(addErrorToCurrencyGraph(error));
  });
};
