import actionTypes from '../constants/actions';
// eslint-disable-next-line
export const addFilter = ({ filterName, value }) => ({
  type: actionTypes.addFilter,
  filterName,
  value,
});
