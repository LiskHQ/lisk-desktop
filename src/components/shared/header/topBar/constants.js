// istanbul ignore file
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
    id: 'transactions',
    label: t('Wallet'),
    path: routes.wallet.path,
  },
  {
    icon: 'delegatesIcon',
    id: 'delegates',
    label: t('Delegates'),
    path: routes.delegates.path,
  },
]);

export default menuLinks;
