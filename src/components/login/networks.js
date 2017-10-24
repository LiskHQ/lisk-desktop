import i18next from 'i18next';

export default () => ([
  {
    name: i18next.t('Mainnet'),
    ssl: true,
    port: 443,
  }, {
    name: i18next.t('Testnet'),
    testnet: true,
    ssl: true,
    port: 443,
  }, {
    name: i18next.t('Custom Node'),
    custom: true,
    address: 'http://localhost:4000',
  },
]);
