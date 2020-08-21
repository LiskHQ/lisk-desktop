// istanbul ignore file
/**
 * This file doesnt have test file
 * because it just calling a function mapper
 * and the functionMapper file it is already tested
 */
import api from '.';

/**
 * Contains conversion rate for a token.
 * @typedef {Object} PriceTicker
 * @property {String} EUR
 * @property {String} USD
 */
/**
 * Retrieves price ticker for given token from the related service.
 * @param {String} tokenType
 * @returns {Promise<PriceTicker>}
 */
const getPriceTicker = (network, tokenType) => api[tokenType].service.getPriceTicker(network);


export default {
  getPriceTicker,
};
