import { selectSearchParamValue } from 'src/utils/searchParams';
import routes from 'src/routes/routes';

/**
 * Extracts only one search param out of the url that is relevant
 * to the screen shown
 * @param {string} path the url path
 */
export const extractRelevantSearchParam = (path) => {
  const relevantRoute = Object.values(routes).find((route) => route.path === path);
  if (relevantRoute) {
    return relevantRoute.searchParam;
  }
  return undefined;
};

/**
 * Gets the searched value depending upon the screen the user is on
 * and the url search
 * @param {object} history the history object
 */
export const getSearchedText = (history) => {
  const screenName = history.location.pathname;
  const relevantSearchParam = extractRelevantSearchParam(screenName);
  const relevantSearchParamValue = selectSearchParamValue(
    history.location.search,
    relevantSearchParam
  );
  return { relevantSearchParam, relevantSearchParamValue };
};
