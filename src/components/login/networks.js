export default () => ([
  {
    name: 'Mainnet',
    ssl: true,
    port: 443,
  }, {
    name: 'Testnet',
    testnet: true,
    ssl: true,
    port: 443,
  }, {
    name: 'Custom Node',
    custom: true,
    address: 'http://localhost:4000',
  },
]);
