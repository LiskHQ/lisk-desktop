/**
 * Merges two arrays and ensures there's no duplicated item
 *
 * @param {String} key - Key to find in array members to ensure uniqueness
 * @param {Array} newData - The new data array
 * @param {Array} oldData - The old data array
 * @returns {Array} Array build by merging the given two arrays
 */
const mergeUniquely = (key, newData, oldData = []) => [
  ...oldData,
  ...newData.data.filter(
    (newItem) => !oldData.find((oldItem) => oldItem[key] === newItem[key]),
  ),
];

export default mergeUniquely;
