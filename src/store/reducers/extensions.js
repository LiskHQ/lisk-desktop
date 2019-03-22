import actionTypes from '../../constants/actions';

const extensions = (state = { modules: {} }, action) => {
  switch (action.type) {
    case actionTypes.moduleAdded:
      return {
        ...state,
        modules: {
          ...state.modules,
          [action.data.identifier]: [
            ...(state.modules[action.data.identifier] || []),
            {
              moduleId: action.data.moduleId,
              data: action.data,
            },
          ],
        },
      };
    default:
      return state;
  }
};

export default extensions;
