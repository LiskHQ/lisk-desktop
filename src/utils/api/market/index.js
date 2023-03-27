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

/**
 * Retrieve the list of announcements by Lisk Foundation.
 *
 * @param {Object} data
 * @param {[String]} data.params.source - News sources
 * @returns {Promise} http call
 */
export const getNews = ({ params = {}, network }) =>
  http({
    path: '/api/v3/newsfeed',
    params,
    network,
  });
