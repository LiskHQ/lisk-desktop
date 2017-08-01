import actionTypes from '../../constants/actions';

/**
 *
 * @param {Array} state
 * @param {Object} action
 */
const toaster = (state = [], action) => {
  switch (action.type) {
    case actionTypes.toastDisplayed:
      return [
        ...state,
        {
          ...action.data,
          index: state.length ? state[state.length - 1].index + 1 : 0,
        },
      ];
    case actionTypes.toastHidden:
      return state.filter(toast => toast.index !== action.data.index);
    default:
      return state;
  }
};

export default toaster;
