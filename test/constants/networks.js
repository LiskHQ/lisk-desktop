/* global Cypress */
import nets from '../../src/constants/networks';

const networks = {
  mainnet: Object.assign(nets.mainnet, {
    node: nets.mainnet.nodes[0],
  }),
  testnet: Object.assign(nets.testnet, {
    node: nets.testnet.nodes[0],
  }),
  devnet: {
    node: Cypress.env('coreUrl'),
  },
};

export default networks;
