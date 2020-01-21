/**
 * Deeply merge two objects recursively, if the value isn't an object it considers
 * the value of the second object.
 * @param {Object} obj1 - Object to be merged into.
 * @param {Object} obj2 - Object with new values to be merged onto obj1.
 */
export const deepMergeObj = (obj1, obj2) =>
  Object.keys({ ...obj2 }).reduce((obj, key) => (
    typeof obj2[key] === 'object' && typeof obj1[key] === 'object'
      && !Array.isArray(obj2[key]) && !Array.isArray(obj1[key])
      ? { ...obj, [key]: deepMergeObj(obj1[key], obj2[key]) }
      : { ...obj, [key]: obj2[key] }
  ), obj1);

/**
 * Removes undefined keys from an object.
 * @param {Object} obj - Source object
 * @returns {Object} - Simplified object
 */
export const removeUndefinedKeys = obj => Object.keys(obj).reduce((acc, key) => {
  const item = obj[key];

  if (typeof item !== 'undefined') {
    acc[key] = item;
  }

  return acc;
}, {});


/**
 * Checks if the given collection is empty.
 * @param {Object|Array} collection
 * @returns {Boolean}
 */
export const isEmpty = (collection) => {
  if (Array.isArray(collection)) {
    return collection.length === 0;
  }

  return Object.keys(collection).length === 0;
};


/**
 * Filters object keys by given value
 * @param {Object} object - object to filter on
 * @param {Any} value - value to be matched against object keys
 * @returns {Array} array of matching keys
 */
export const filterObjectPropsWithValue = (object = {}, value) => (
  Object.keys(object).filter(key => object[key] === value)
);

/**
 * Creates mailto link from an error
 * @param {string} error - error message to put into the email body
 * @returns {sting} mailto link with recipient, subject, and body
 */
export const getErrorReportMailto = (error) => {
  const recipient = 'hubdev@lisk.io';
  const subject = `User Reported Error - Lisk - ${VERSION}`; // eslint-disable-line no-undef
  return `mailto:${recipient}?&subject=${subject}&body=${error}`;
};

/**
 * Flattens array to be one level deep.
 * @param {Array} arr - Array to be flattened
 * @returns {Array} Flattened array
 */
export const flattenArray = arr =>
  arr.reduce((acc, item) =>
    (Array.isArray(item)
      ? [...acc, ...flattenArray(item)]
      : [...acc, item]), []).filter(item => !!item);

/**
 * Returns the size of a given string in bytes
 *
 * @param {string} str - a random string
 * @returns {number} - string size in bytes
 */
export const sizeOfString = str => encodeURI(str).split(/%..|./).length - 1;

/**
 * Checks if a given parameter is a React component
 *
 * @param {any} component - the target to test
 * @returns {string|boolean} - Component type or false
 */
export const isReactComponent = (component) => {
  if (typeof component === 'function' && component.prototype.isReactComponent) {
    return 'class';
  }
  if (typeof component === 'function' && typeof component().$$typeof === 'symbol') {
    return 'function';
  }
  return false;
};
