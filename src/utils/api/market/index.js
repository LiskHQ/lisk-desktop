import http from '../http';

const httpPrefix = '/api/v1';

export const httpPaths = {
  news: `${httpPrefix}/market/newsfeed`,
};


export const getPrices = data => new Promise(resolve =>
  resolve({ endpoint: 'getPrices', token: 'LSK', data }));

/**
 * Retrieves newsfeed
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
