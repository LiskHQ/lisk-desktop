
export const deepMergeObj = (obj1, obj2) =>
  Object.keys({ ...obj2 }).reduce((obj, key) => (
    typeof obj2[key] === 'object' && typeof obj1[key] === 'object'
      ? { ...obj, [key]: deepMergeObj(obj1[key], obj2[key]) }
      : { ...obj, [key]: obj2[key] }
  ), obj1);

export default {
  deepMergeObj,
};
