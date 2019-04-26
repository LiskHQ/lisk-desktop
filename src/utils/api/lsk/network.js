import Lisk from 'lisk-elements';
import networks from '../../../constants/networks';
import { tokenMap } from '../../../constants/tokens';

const apiClients = {};

// eslint-disable-next-line import/prefer-default-export
export const getAPIClient = (network) => {
  if (!apiClients[network.name] || network.name === networks.customNode.name) {
    const { nethash, nodes } = {
      [networks.testnet.name]: {
        nethash: Lisk.APIClient.constants.TESTNET_NETHASH,
        nodes: networks.testnet.nodes,
      },
      [networks.mainnet.name]: {
        nethash: Lisk.APIClient.constants.MAINNET_NETHASH,
        nodes: networks.mainnet.nodes,
      },
      [networks.customNode.name]: {
        nethash: network[tokenMap.LSK.key] && network[tokenMap.LSK.key].nethash,
        nodes: [network[tokenMap.LSK.key] && network[tokenMap.LSK.key].nodeUrl],
      },
    }[network.name] || {};
    apiClients[network.name] = new Lisk.APIClient(nodes, { nethash });
  }
  return apiClients[network.name];
};
