/**
 * returns parsed query params from a url
 */
export const parseSearchParams = (search) => {
  const searchParams = new URLSearchParams(decodeURIComponent(search));
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
 */
export const addSearchParamsToUrl = (history, data) => {
  const newSearchString = appendSearchParams(history.location.search, data);
  history.push(`${history.location.pathname}${newSearchString}`);
};

/**
 * removes a query param to the url and redirects to that url
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
  state,
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
  if (state) {
    history.push({ search: `${formattedSearchString}`, state });
  } else {
    history.push(`${history.location.pathname}${formattedSearchString}`);
  }
};
