import Lisk from 'lisk-elements';
import { tokenMap } from '../../constants/tokens';

// eslint-disable-next-line import/prefer-default-export
export const getLiskAPIClient = (state) => {
  const network = state.network[tokenMap.LSK.key];
  return new Lisk.APIClient([network.nodeUrl], { nethash: network.nethash });
};
