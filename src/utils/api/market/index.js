import http from '../http';

const httpPrefix = '/api/v1';

export const httpPaths = {
  prices: `${httpPrefix}/market/prices`,
  news: `${httpPrefix}/market/newsfeed`,
};

/**
 * Retrieve the market prices and exchange ratios.
 *
 * @returns {Promise} http call
 */
export const getPrices = () => http({
  path: httpPaths.prices,
  baseUrl: 'https://cloud.lisk.io',
});

/**
 * Retrieve the list of announcements by Lisk Foundation.
 *
 * @param {Object} data
 * @param {[String]} data.params.source - News sources
 * @returns {Promise} http call
 */
export const getNews = ({
  params = {},
}) => http({
  path: httpPaths.news,
  params,
  baseUrl: 'https://cloud.lisk.io',
});
