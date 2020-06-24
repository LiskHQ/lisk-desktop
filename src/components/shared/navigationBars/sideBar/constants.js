import routes from '../../../../constants/routes';

const menuLinks = t => ([
  [
    {
      icon: 'dashboardIcon',
      id: 'dashboard',
      label: t('Dashboard'),
      path: routes.dashboard.path,
    },
    {
      icon: 'walletIcon',
      id: 'wallet',
      label: t('Wallet'),
      path: routes.wallet.path,
    },
    {
      icon: 'voting',
      id: 'voting',
      label: t('Voting'),
      path: routes.voting.path,
    },
  ],
  [
    {
      icon: 'networkMonitor',
      id: 'monitorNetwork',
      label: t('Network'),
      path: routes.monitorNetwork.path,
    },
    {
      icon: 'transactionsMonitor',
      id: 'monitorTransactions',
      label: t('Transactions'),
      path: routes.monitorTransactions.path,
    },
    {
      icon: 'blocksMonitor',
      id: 'blockDetails',
      label: t('Blocks'),
      path: routes.blockDetails.path,
    },
    {
      icon: 'accountsMonitor',
      id: 'monitorAccounts',
      label: t('Accounts'),
      path: routes.monitorAccounts.path,
    },
    {
      icon: 'delegatesMonitor',
      id: 'delegatesMonitor',
      label: t('Delegates'),
      path: routes.delegatesMonitor.path,
    },
  ],
  [
    {
      icon: 'signMessage',
      id: 'signMessage',
      label: t('Sign Message'),
      modal: 'signMessage',
    },
    {
      icon: 'verifyMessage',
      id: 'verifyMessage',
      label: t('Verify Message'),
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
]);

export default menuLinks;
