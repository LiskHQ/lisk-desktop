/**
 * returns parsed query params from a url
 * @param {String} search the search string
 */

export const parseSearchParams = (search) => {
  const searchParams = new URLSearchParams(search);
  const parsedParams = {};

  // eslint-disable-next-line no-restricted-syntax, no-unused-vars
  for (const [key, value] of searchParams.entries()) {
    const values = value.split(',');
    if (values.length > 1) {
      parsedParams[key] = values;
    } else {
      parsedParams[key] = value;
    }
  }

  return parsedParams;
};

/**
 * returns the value of a search param from a search string
 * @param {string} search the search string
 * @param {string|string[]} query The query parameters to search for their value
 * This can be a string, or an array of string.
 * @returns {any, any[]} It'll return the value of the given query,
 * If an array is passed, it'll return an array corresponding values of the query
 * If a query parameter is not present in search string, it'll return null.
 */
export const selectSearchParamValue = (search, query) => {
  const isArray = Array.isArray(query);
  const parsed = parseSearchParams(search);
  const queryInArray = isArray ? query : [query];
  const values = queryInArray.map((item) => parsed[item]);
  return isArray ? values : values[0];
};

/**
 * returns parsed query params from a url
 * @param {object} params the parsed searchParams object
 */
export const stringifySearchParams = (params) => {
  const result = [];

  Object.keys(params).forEach((key) => {
    const value = params[key];
    result.push(`${key}=${value}`);
  });

  let stringifiedResult = result.join('&');
  if (result.length > 0) {
    stringifiedResult = `?${stringifiedResult}`;
  }

  return stringifiedResult;
};

/**
 * returns adds query param to a url and returns the new url
 * @param {String} search the search string
 * @param {object} data the key-value dictionary to add
 */
export const appendSearchParams = (search, data) => {
  const searchParams = parseSearchParams(search);
  Object.keys(data).forEach((key) => {
    searchParams[key] = data[key];
  });
  return stringifySearchParams(searchParams);
};

/**
 * removes query param from a url and returns the new url
 * @param {String} search the search string
 * @param {String[]} paramsToRemove an array of param keys to remove
 */
export const removeSearchParams = (search, paramsToRemove, cleanParamsAfter) => {
  const params = parseSearchParams(search);

  if (cleanParamsAfter) {
    const paramKeys = Object.keys(params);
    const indexToStartRemovingFrom = paramKeys.findIndex((param) => param === paramsToRemove[0]);
    Object.keys(params)
      .slice(indexToStartRemovingFrom)
      .forEach((key) => {
        delete params[key];
      });
  } else {
    paramsToRemove.forEach((key) => {
      delete params[key];
    });
  }

  return stringifySearchParams(params);
};

/**
 * adds a query param to the url and redirects to that url
 * @param {object} history the search string
 * @param {object} data the key-value dictionary to add
 */
export const addSearchParamsToUrl = (history, data = {}) => {
  const newSearchString = appendSearchParams(history.location.search, data);
  history.push(`${history.location.pathname}${newSearchString}`);
};

/**
 * removes a query param to the url and redirects to that url
 *
 * @param {object} history the search string
 * @param {string[]} [paramsToRemove] the array of params to remove. Leave it blank to remove all.
 * @param {boolean} [cleanParamsAfter] clean parameters
 */
export const removeSearchParamsFromUrl = (history, paramsToRemove, cleanParamsAfter) => {
  let newSearchString = '';
  if (Array.isArray(paramsToRemove) && paramsToRemove.length) {
    newSearchString = removeSearchParams(history.location.search, paramsToRemove, cleanParamsAfter);
  }
  history.push(`${history.location.pathname}${newSearchString}`);
};

export const removeThenAppendSearchParamsToUrl = (
  history,
  paramsToAdd,
  paramsToRemove,
  cleanParamsAfter
) => {
  let newSearchString = '';
  let formattedSearchString = '';
  if (Array.isArray(paramsToRemove) && paramsToRemove.length) {
    newSearchString = removeSearchParams(history.location.search, paramsToRemove, cleanParamsAfter);
  }
  if (newSearchString.length) {
    formattedSearchString = appendSearchParams(history.location.search, paramsToAdd);
  } else {
    formattedSearchString = appendSearchParams('', paramsToAdd);
  }
  history.push(`${history.location.pathname}${formattedSearchString}`);
};
