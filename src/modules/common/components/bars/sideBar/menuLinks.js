import routes from 'src/routes/routes';

const menuLinks = (t) => [
  [
    {
      icon: 'walletIcon',
      id: 'wallet',
      label: t('Wallet'),
      path: routes.wallet.path,
    },
  ],
  [
    {
      icon: 'applicationsIcon',
      id: 'blockchainApplications',
      label: t('Applications'),
      path: routes.blockchainApplications.path,
    },
    {
      icon: 'transactionsMonitor',
      id: 'transactions',
      label: t('Transactions'),
      path: routes.transactions.path,
    },
    {
      icon: 'blocksMonitor',
      id: 'blocks',
      label: t('Blocks'),
      path: routes.blocks.path,
    },
    {
      icon: 'validatorsMonitor',
      id: 'validators',
      label: t('Validators'),
      path: routes.validators.path,
    },
    {
      icon: 'walletsMonitor',
      id: 'wallets',
      label: t('Accounts'),
      path: routes.wallets.path,
    },
    {
      icon: 'networkMonitor',
      id: 'network',
      label: t('Network'),
      path: routes.network.path,
    },
  ],
  [
    {
      icon: 'multiSignatureOutline',
      id: 'signMultiSignTransaction',
      label: t('Sign multisignature transaction'),
      modal: 'signMultiSignTransaction',
    },
    {
      icon: 'signMessage',
      id: 'signMessage',
      label: t('Sign message'),
      modal: 'signMessage',
    },
    {
      icon: 'verifyMessage',
      id: 'verifyMessage',
      label: t('Verify message'),
      modal: 'verifyMessage',
    },
  ],
  [
    {
      icon: 'settings',
      id: 'settings',
      label: t('Settings'),
      modal: 'settings',
    },
  ],
];

export default menuLinks;
