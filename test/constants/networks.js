/* global Cypress */
const networks = {
  mainnet: {
    url: 'https://hub21.lisk.io',
  },
  testnet: {
    url: 'https://testnet.lisk.io',
  },
  devnet: {
    url: Cypress.env('coreUrl'),
  },
};

export default networks;
