
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

  // eslint-disable-next-line no-restricted-syntax
  for (const key of Object.keys(params)) {
    const value = params[key];
    result.push(`${key}=${value}`);
  }

  let stringifiedResult = result.join('&');
  if (result.length > 0) {
    stringifiedResult = `?${stringifiedResult}`;
  }

  return stringifiedResult;
};

/**
 * returns adds query param to a url and returns the new url
 * @param {String} search the search string
 * @param {String} key the key of the param to append
 * @param {String | Number} value the value of the param to append
 */
export const appendSearchParams = (search, key, value) => {
  const searchParams = parseSearchParams(search);
  searchParams[key] = value;
  return strigifySearchParams(searchParams);
};

/**
 * removes query param from a url and returns the new url
 * @param {String} search the search string
 * @param {String} key the key of the param to remove
 */
export const removeSearchParam = (search, paramToRemove) => {
  const params = parseSearchParams(search);
  delete params[paramToRemove];
  return strigifySearchParams(params);
};

/**
 * adds a query param to the url and redirects to that url
 * @param {object} history the search string
 * @param {String} key the key of the param to append
 * @param {String | Number} value the value of the param to append
 */
export const addSearchParamToUrl = (history, key, value) => {
  const newSearchParams = appendSearchParams(history.location.search, key, value);
  history.push(`${history.location.pathname}${newSearchParams}`);
};

/**
 * removes a query param to the url and redirects to that url
 * @param {object} history the search string
 * @param {String} paramToRemove the param ro remove
 */
export const removeSearchParamFromUrl = (history, paramToRemove) => {
  const newSearchParams = removeSearchParam(history.location.search, paramToRemove);
  history.push(`${history.location.pathname}${newSearchParams}`);
};
