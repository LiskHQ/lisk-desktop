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
  ],
  [
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
