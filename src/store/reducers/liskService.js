import BigNumber from 'bignumber.js';
import actionTypes from '../../constants/actions';

/**
 * Converts candles response into x,y coordinate positions for the graph
 * @param {Array} candlesResponse array of candles to show
 * @param {Object} target step configuration
 */
const getCandlesForGraph = (candles = [], step) => ({
  data: candles.slice(Math.max(candles.length - step.length, 1))
    .map(c => ({
      x: new Date(c.date),
      y: new BigNumber(c.high).plus(new BigNumber(c.low)).dividedBy(2),
    })),
});

const liskService = (state = [], action) => {
  switch (action.type) {
    case actionTypes.clearDataOfCurrencyGraph:
      return {
        ...state,
        candles: undefined,
        graphError: undefined,
      };
    case actionTypes.addDataToCurrencyGraph:
      return {
        ...state,
        candles: getCandlesForGraph(action.data.response.candles, action.data.step),
        step: action.data.step,
        graphError: undefined,
      };
    case actionTypes.addErrorToCurrencyGraph:
      return {
        ...state,
        graphError: action.data,
      };
    default:
      return state;
  }
};

export default liskService;
