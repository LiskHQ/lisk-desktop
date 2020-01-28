import liskClient from 'Utils/lisk-client'; // eslint-disable-line
import networks from '../../../constants/networks';
import { tokenMap } from '../../../constants/tokens';

const apiClients = {};

// eslint-disable-next-line import/prefer-default-export
export const getAPIClient = (network) => {
  const Lisk = liskClient();
  if (network.name && (!apiClients[network.name] || network.name === networks.customNode.name)) {
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
        nethash: network.networks[tokenMap.LSK.key] && network.networks[tokenMap.LSK.key].nethash,
        nodes: [network.networks[tokenMap.LSK.key] && network.networks[tokenMap.LSK.key].nodeUrl],
      },
    }[network.name] || {};
    // @todo if we delete nethash it will work just fine
    apiClients[network.name] = new Lisk.APIClient(nodes, { nethash });
    apiClients[network.name].networkConfig = network;
  }
  return apiClients[network.name];
};
