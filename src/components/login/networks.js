export default () => ([
  {// network name translation t('Mainnet');
    name: 'Mainnet',
    ssl: true,
    port: 443,
  }, {// network name translation t('Testnet');
    name: 'Testnet',
    testnet: true,
    ssl: true,
    port: 443,
  }, {// network name translation t('Custom Node');
    name: 'Custom Node',
    custom: true,
    address: 'http://localhost:4000',
  },
]);
