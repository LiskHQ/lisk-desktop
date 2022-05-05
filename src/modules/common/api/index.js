import http from 'src/utils/http';

const httpPrefix = '/api/v2';

export const httpPaths = {
  prices: `${httpPrefix}/market/prices`,
};

/**
 * Retrieve the market prices and exchange ratios.
 *
 * @returns {Promise} http call
 */
export const getPrices = ({ network }) => http({
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
export const getNews = ({
  params = {}, network,
}) => http({
  path: '/api/v2/newsfeed',
  params,
  network,
});
