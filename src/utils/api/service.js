// istanbul ignore file
/**
 * This file doesnt have test file
 * because it just calling a function mapper
 * and the functionMapper file it is already tested
 */
import getMappedFunction from './functionMapper';

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
const getPriceTicker = tokenType => getMappedFunction(tokenType, 'service', 'getPriceTicker')();

/**
 * Contains dynamic fee rates for a token to indicate processing speed on the blockchain.
 * Properties are formatted as satoshis/byte for BTC.
 * @typedef {Object} DynamicFees
 * @property {Number} Low
 * @property {Number} Medium
 * @property {Number} High
 */
/**
 * Retrieves dynamic fees for given token from the related service.
 * @param {String} tokenType
 * @returns {Promise<DynamicFees>}
 */
const getDynamicFees = tokenType => getMappedFunction(tokenType, 'service', 'getDynamicFees')();


export default {
  getDynamicFees,
  getPriceTicker,
};
