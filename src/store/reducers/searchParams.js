import actionTypes from '../../constants/actions';
import { parseSearchParams } from '../../utils/searchParams';


const getInitialState = () => {
  const { modal } = parseSearchParams(window.location.search);
  return { modal };
};

/**
 * The reducer for handling changes to the search params
 *
 * @param {object} state - the current state object
 * @param {object} action - The action containing type and data
 *
 * @returns {object} - Next state object
 */
const searchParams = (state = getInitialState(), action) => {
  switch (action.type) {
    case actionTypes.modalParamChanged:
      return {
        ...state,
        modal: action.data.modal,
      };
    default:
      return state;
  }
};

export default searchParams;
