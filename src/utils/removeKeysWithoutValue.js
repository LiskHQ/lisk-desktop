// eslint-disable-next-line import/prefer-default-export
export const removeKeysWithoutValue = (params) =>
  Object.entries(params)
    .filter(([, val]) => val !== '')
    .reduce((obj, [key, val]) => ({ ...obj, [key]: val }), {});
