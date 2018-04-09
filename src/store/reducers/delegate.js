import actionTypes from '../../constants/actions';

const delegate = (state = [], action) => {
  switch (action.type) {
    case actionTypes.delegatesRetrieved:
      return { delegateNameInvalid: action.data.delegate !== undefined };
    default:
      return state;
  }
};

export default delegate;
