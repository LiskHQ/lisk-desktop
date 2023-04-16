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

export function imSetToArray(array = [], mapToAdd = {}, objUniqueField = '', index) {
  const indexToUpdate =
    index || array.findIndex((arrayItem) => arrayItem[objUniqueField] === mapToAdd[objUniqueField]);

  if (indexToUpdate === -1) {
    return imPush(array, mapToAdd);
  }
  // mapToAdd obj exists in list. Update old obj with mapToAdd
  const firstPart = imPush(array.slice(0, indexToUpdate), mapToAdd);
  const secondPart = array.slice(indexToUpdate + 1);
  return imArrayMerge(firstPart, secondPart);
}
