/**
 * returns parsed query params from a url
 * @param {String} search the search string
 */
// eslint-disable-next-line import/prefer-default-export
export const parseSearchParams = (search) => {
  const searchParams = new URLSearchParams(search);
  const parsedParams = {};

  // eslint-disable-next-line no-restricted-syntax, no-unused-vars
  for (const [key, value] of searchParams.entries()) {
    const values = value.split(',');
    if (values.length > 1) {
      parsedParams[key] = values;
    } else { parsedParams[key] = value; }
  }

  return parsedParams;
};

/**
 * returns the value of a search param from a search string
 * @param {string} search the search string
 * @param {string} paramToSelect the param to get the value of
 */
// eslint-disable-next-line import/prefer-default-export
export const selectSearchParamValue = (search, paramToSelect) =>
  parseSearchParams(search)[paramToSelect];

/**
 * returns parsed query params from a url
 * @param {object} params the parsed searchParams object
 */
// eslint-disable-next-line import/prefer-default-export
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
    const indexToStartRemovingFrom = paramKeys.findIndex(param => param === paramsToRemove[0]);
    Object.keys(params).slice(indexToStartRemovingFrom).forEach((key) => {
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
 * @param {?String} paramsToRemove the array of params to remove. Leave it blank to remove all.
 */
export const removeSearchParamsFromUrl = (history, paramsToRemove, cleanParamsAfter) => {
  let newSearchString = '';
  if (Array.isArray(paramsToRemove) && paramsToRemove.length) {
    newSearchString = removeSearchParams(history.location.search, paramsToRemove, cleanParamsAfter);
  }
  history.push(`${history.location.pathname}${newSearchString}`);
};
