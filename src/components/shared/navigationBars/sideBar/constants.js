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
      id: 'network',
      label: t('Network'),
      path: routes.network.path,
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
      icon: 'accountsMonitor',
      id: 'accounts',
      label: t('Accounts'),
      path: routes.accounts.path,
    },
    {
      icon: 'delegatesMonitor',
      id: 'delegates',
      label: t('Delegates'),
      path: routes.delegates.path,
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
