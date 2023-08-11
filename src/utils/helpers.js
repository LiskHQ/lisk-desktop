/**
 * Deeply merge two objects recursively, if the value isn't an object it considers
 * the value of the second object.
 */
export const deepMergeObj = (obj1, obj2) =>
  Object.keys({ ...obj2 }).reduce(
    (obj, key) =>
      typeof obj2[key] === 'object' &&
      typeof obj1[key] === 'object' &&
      !Array.isArray(obj2[key]) &&
      !Array.isArray(obj1[key])
        ? { ...obj, [key]: deepMergeObj(obj1[key], obj2[key]) }
        : { ...obj, [key]: obj2[key] },
    obj1
  );

export const removeUndefinedKeys = (obj) =>
  Object.keys(obj).reduce((acc, key) => {
    const item = obj[key];

    if (typeof item !== 'undefined') {
      acc[key] = item;
    }

    return acc;
  }, {});

/**
 * Checks if the given collection is empty.
 */
export const isEmpty = (collection) => {
  if (!collection) return true;
  if (Array.isArray(collection)) {
    return collection.length === 0;
  }

  return Object.keys(collection).length === 0;
};

/**
 * Creates mailto link from an error
 */
export const getErrorReportMailto = ({
  error = 'Unknown error occurred',
  errorMessage,
  serviceUrl,
  liskCoreVersion,
}) => {
  const recipient = 'desktopdev@lisk.com';
  const subject = `User Reported Error - Lisk - ${VERSION}`; // eslint-disable-line no-undef
  const body = encodeURIComponent(`
    \nImportant metadata for the team, please do not edit:
    \r
    Lisk Core Version: ${liskCoreVersion}, ServiceURL: ${serviceUrl}
    \r
    Error Message: ${errorMessage}
    \r
    Transaction: ${error}
  `);
  return `mailto:${recipient}?&subject=${subject}&body=${body}`;
};

/**
 * Flattens array to be one level deep.
 */
export const flattenArray = (arr) =>
  arr
    .reduce(
      (acc, item) => (Array.isArray(item) ? [...acc, ...flattenArray(item)] : [...acc, item]),
      []
    )
    .filter((item) => !!item);

/**
 * Returns the size of a given string in bytes
 */
export const sizeOfString = (str = '') => encodeURI(str).split(/%..|./).length - 1;

export const isReactComponent = (component) => {
  if (typeof component === 'function' && component.prototype.isReactComponent) {
    return 'class';
  }
  if (typeof component === 'function' && typeof component().$$typeof === 'symbol') {
    return 'function';
  }
  return false;
};

/**
 * Uses M and K to define million and thousand.
 * @returns {String} Stringified number like 2.5K
 */
export const kFormatter = (num, precision = 0) => {
  if (Number(num) > 999999) {
    return `${(Number(num) / 1000000).toFixed(precision)}M`;
  }
  if (Number(num) > 999) {
    return `${(Number(num) / 1000).toFixed(precision)}K`;
  }
  return num;
};

/**
 * Convert given strings to capitalized format
 * sample string -> Sample string
 * sampleString -> Samplestring
 */
export const capitalize = (str) => str.toLowerCase().replace(/^\w/, (c) => c.toUpperCase());
