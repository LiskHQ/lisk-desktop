import Lisk from 'lisk-elements';
import networks from '../../../constants/networks';
import { tokenMap } from '../../../constants/tokens';

const apiClients = {};

// eslint-disable-next-line import/prefer-default-export
export const getAPIClient = (network) => {
  if (!apiClients[network.name] || network.name === networks.customNode.name) {
    let { nethash } = network[tokenMap.LSK.key];
    let nodes = [network[tokenMap.LSK.key].nodeUrl];
    if (network.name === networks.testnet.name) {
      nethash = Lisk.APIClient.constants.TESTNET_NETHASH;
      nodes = networks.testnet.nodes;
    } else if (network.name === networks.mainnet.name) {
      nethash = Lisk.APIClient.constants.MAINNET_NETHASH;
      nodes = networks.mainnet.nodes;
    }
    apiClients[network.name] = new Lisk.APIClient(nodes, { nethash });
  }
  return apiClients[network.name];
};
