import routes from '../../../../constants/routes';

const menuLinks = t => ([
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
    icon: 'delegatesIcon',
    id: 'delegates',
    label: t('Delegates'),
    path: routes.delegates.path,
  },
  {
    icon: 'monitorIcon',
    id: 'monitor',
    label: t('Monitor'),
    path: routes.monitor.path,
  },
]);

export default menuLinks;
