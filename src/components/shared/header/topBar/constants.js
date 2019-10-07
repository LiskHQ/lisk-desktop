// istanbul ignore file
import { tokenMap } from '../../../../constants/tokens';
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
    forbiddenTokens: [tokenMap.BTC.key],
  },
  {
    icon: 'dashboardIcon',
    id: 'monitor',
    label: t('Monitor'),
    path: routes.monitor.path,
    forbiddenTokens: [tokenMap.BTC.key],
  },
]);

export default menuLinks;
