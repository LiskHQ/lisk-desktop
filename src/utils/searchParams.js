
// eslint-disable-next-line import/prefer-default-export
export const parseSearchParams = (search) => {
  const searchParams = new URLSearchParams(search);
  const parsedParams = {};
  // eslint-disable-next-line no-restricted-syntax
  for (const [key, value] of searchParams.entries()) {
    parsedParams[key] = value;
  }
  return parsedParams;
};
