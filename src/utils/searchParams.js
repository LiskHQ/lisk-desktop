
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
