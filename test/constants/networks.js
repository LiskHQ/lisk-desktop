/* global Cypress */
import nets from '../../src/constants/networks';

const networks = {
  mainnet: { ...nets.mainnet, node: nets.mainnet.nodes[0] },
  testnet: { ...nets.testnet, node: nets.testnet.nodes[0] },
  devnet: {
    node: Cypress.env('coreUrl'),
    serviceUrl: Cypress.env('serviceUrl'),
  },
};

export default networks;
