export function imPush(arr, newEntry) {
  const safeSpread = arr || [];
  return [...safeSpread, newEntry];
}
export function imArrayMerge(first = [], second = []) {
  const safeSpreadFirst = first || [];
  const safeSpreadSecond = second || [];
  return [...safeSpreadFirst, ...safeSpreadSecond];
}
export function imDeleteFromArray(array = [], index) {
  const firstPart = array.slice(0, index);
  const secondPart = array.slice(index + 1);

  return imArrayMerge(firstPart, secondPart);
}

export function imDeleteFromArrayById(array = [], idFieldName, idValue) {
  const indexToDelete = array.findIndex((arrayItem) => arrayItem[idFieldName] === idValue);

  return imDeleteFromArray(array, indexToDelete);
}
