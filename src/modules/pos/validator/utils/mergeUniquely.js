/**
 * Merges two arrays and ensures there's no duplicated item
 */
const mergeUniquely = (key, newData, oldData = []) => [
  ...oldData,
  ...newData.data.filter((newItem) => !oldData.find((oldItem) => oldItem[key] === newItem[key])),
];

export default mergeUniquely;
