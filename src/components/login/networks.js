import env from '../../constants/env';

export default [
  {
    name: 'Mainnet',
    ssl: true,
    port: 443,
  }, {
    name: 'Testnet',
    testnet: true,
  }, {
    name: 'Custom Node',
    custom: true,
    address: 'http://localhost:4000',
    ...(env.production ? {} : {
      testnet: true,
      nethash: '198f2b61a8eb95fbeed58b8216780b68f697f26b849acf00c8c93bb9b24f783d',
    }),
  },
];
