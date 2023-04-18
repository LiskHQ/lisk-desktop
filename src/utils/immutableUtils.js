export function immutablePush(arr, newEntry) {
  const safeSpread = arr || [];
  return [...safeSpread, newEntry];
}
export function immutableArrayMerge(first = [], second = []) {
  const safeSpreadFirst = first || [];
  const safeSpreadSecond = second || [];
  return [...safeSpreadFirst, ...safeSpreadSecond];
}

export function immutableDeleteFromArray(array = [], index) {
  if (index === -1) {
    return array;
  }
  const firstPart = array.slice(0, index);
  const secondPart = array.slice(index + 1);

  return immutableArrayMerge(firstPart, secondPart);
}

export function immutableDeleteFromArrayById(array = [], idFieldName, idValue) {
  const indexToDelete = array.findIndex((arrayItem) => arrayItem[idFieldName] === idValue);

  return immutableDeleteFromArray(array, indexToDelete);
}

export function immutableSetToArray({ array = [], mapToAdd = {}, objUniqueField = '', index }) {
  const indexToUpdate =
    index || array.findIndex((arrayItem) => arrayItem[objUniqueField] === mapToAdd[objUniqueField]);

  if (indexToUpdate === -1) {
    return immutablePush(array, mapToAdd);
  }
  // mapToAdd obj exists in list. Update old obj with mapToAdd
  const firstPart = immutablePush(array.slice(0, indexToUpdate), mapToAdd);
  const secondPart = array.slice(indexToUpdate + 1);
  return immutableArrayMerge(firstPart, secondPart);
}
