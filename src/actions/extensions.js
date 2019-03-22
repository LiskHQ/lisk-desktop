import actionTypes from '../constants/actions';

/* eslint-disable-next-line import/prefer-default-export */
export const moduleAdded = ({ identifier, moduleId }) => ({
  data: {
    identifier,
    moduleId,
  },
  type: actionTypes.moduleAdded,
});
