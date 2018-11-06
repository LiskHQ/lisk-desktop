import BigNumber from 'bignumber.js';
import actionTypes from '../../constants/actions';

/**
 * Converts candles response into x,y coordinate positions for the graph
 * @param {Array} candlesResponse array of candles to show
 * @param {Object} target step configuration
 */
const getPricesForGraph = ({ prices = [], step }) => ({
  data: prices.slice(Math.max(prices.length - step.length, 1))
    .map(c => ({
      x: new Date(c.date),
      y: new BigNumber(c.high).plus(new BigNumber(c.low)).dividedBy(2),
    })),
});

const liskService = (state = {}, action) => {
  switch (action.type) {
    case actionTypes.clearDataOfCurrencyGraph:
      return {
        ...state,
        prices: undefined,
        graphError: undefined,
      };
    case actionTypes.addDataToCurrencyGraph:
      return {
        ...state,
        prices: getPricesForGraph({
          prices: action.data.response.candles,
          step: action.data.step,
        }),
        step: action.data.step,
        graphError: undefined,
      };
    case actionTypes.getNewsFeed:
      return {
        ...state,
        newsFeed: action.data,
      };
    case actionTypes.showEmptyNewsFeed:
      return {
        ...state,
        showNewsFeedEmptyState: action.data.showNewsFeedEmptyState,
      };
    case actionTypes.addErrorToCurrencyGraph:
      return {
        ...state,
        graphError: action.data,
      };
    case actionTypes.addPriceTicker:
      return {
        ...state,
        priceTicker: action.data,
      };
    default:
      return state;
  }
};

export default liskService;
