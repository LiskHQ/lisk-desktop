/**
 * Deep compare any two parameter for equality. if not a primary value,
 * compares all the members recursively checking if all primary value members are equal
 *
 * @private
 * @method equals
 * @param {any} ref1 - Value to compare equality
 * @param {any} ref2 - Value to compare equality
 * @returns {Boolean} Whether two parameters are equal or not
 */
/* eslint-disable import/prefer-default-export  */
export const deepEquals = (ref1, ref2) => {
  /* eslint-disable eqeqeq */

  if (ref1 == undefined && ref2 == undefined) {
    return true;
  }
  if (typeof ref1 !== typeof ref2 || (typeof ref1 !== 'object' && ref1 != ref2)) {
    return false;
  }

  const props1 = (ref1 instanceof Array) ? ref1.map((val, idx) => idx) : Object.keys(ref1).sort();
  const props2 = (ref2 instanceof Array) ? ref2.map((val, idx) => idx) : Object.keys(ref2).sort();

  let isEqual = true;

  props1.forEach((value1, index) => {
    if (typeof ref1[value1] === 'object' && typeof ref2[props2[index]] === 'object') {
      if (!deepEquals(ref1[value1], ref2[props2[index]])) {
        isEqual = false;
      }
    } else if (ref1[value1] != ref2[props2[index]]) {
      isEqual = false;
    }
  });
  return isEqual;
};
