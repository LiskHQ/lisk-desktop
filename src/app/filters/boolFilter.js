app.filter('boolFilter', () => (list, filterObj) => (list || []).filter((value) => {
  let returnValue = true;
  Object.keys(filterObj).forEach((key) => {
    returnValue = returnValue && value[key][filterObj[key]];
  });
  return returnValue;
}));

