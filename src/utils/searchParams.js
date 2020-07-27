/**
 * returns parsed query params from a url
 * @param {String} search the search string
 */
// eslint-disable-next-line import/prefer-default-export
export const parseSearchParams = (search) => {
  const searchParams = new URLSearchParams(search);
  const parsedParams = {};
  // eslint-disable-next-line no-restricted-syntax
  for (const [key, value] of searchParams.entries()) {
    const values = value.split(',');
    if (values.length > 1) {
      parsedParams[key] = values;
    } else { parsedParams[key] = value; }
  }
  return parsedParams;
};

/**
 * returns parsed query params from a url
 * @param {object} params the parsed searchParams object
 */
// eslint-disable-next-line import/prefer-default-export
export const strigifySearchParams = (params) => {
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
  return strigifySearchParams(searchParams);
};

/**
 * removes query param from a url and returns the new url
 * @param {String} search the search string
 * @param {String[]} paramsToRemove an array of param keys to remove
 */
export const removeSearchParams = (search, paramsToRemove) => {
  const params = parseSearchParams(search);
  paramsToRemove.forEach((key) => {
    delete params[key];
  });
  return strigifySearchParams(params);
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
export const removeSearchParamsFromUrl = (history, paramsToRemove) => {
  let newSearchString = '';
  if (Array.isArray(paramsToRemove) && paramsToRemove.length) {
    newSearchString = removeSearchParams(history.location.search, paramsToRemove);
  }
  history.push(`${history.location.pathname}${newSearchString}`);
};
