/**
 * This filter format numbers and add comma sperator to them
 *
 * @module app
 */
app.filter('liskNumber', ($filter) => {
  const numberFilter = $filter('number');
  return (input) => {
    const temp = input.toString().split('.');
    if (temp.length === 1) {
      return numberFilter(temp[0]);
    }
    return `${numberFilter(temp[0])}.${temp[1]}`;
  };
});
