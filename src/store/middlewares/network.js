import { networkConfigSet } from '../../actions/network';
import actionsType from '../../constants/actions';

const network = ({ dispatch }) => next => async (action) => {
  switch (action.type) {
    case actionsType.networkSelected: {
      dispatch(await networkConfigSet(action.data));
      break;
    }
    default:
      break;
  }
  next(action);
};

export default network;
