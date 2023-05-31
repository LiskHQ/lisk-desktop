import http from 'src/utils/api/http';
import { HTTP_PREFIX } from 'src/const/httpCodes';

export const httpPaths = {
  prices: `${HTTP_PREFIX}/market/prices`,
};

/**
 * Retrieve the market prices and exchange ratios.
 *
 * @returns {Promise} http call
 */
export const getPrices = ({ network }) =>
  http({
    path: httpPaths.prices,
    network,
  });
