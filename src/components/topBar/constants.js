// istanbul ignore file
import svg from '../../utils/svgIcons';
import routes from '../../constants/routes';

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
    label: t('My Wallet'),
    path: routes.wallet.path,
  },
  {
    icon: 'delegatesIcon',
    id: 'delegates',
    label: t('Delegates'),
    path: routes.delegates.path,
  },
]);

export const dropdownLinks = t => ({
  settings: {
    icon_active: svg.settings_active_icon,
    icon: svg.settings_icon,
    id: 'settings',
    label: t('Settings'),
    path: `${routes.setting.path}`,
  },
  logout: {
    icon_active: svg.logout_active_icon,
    icon: svg.logout_icon,
    id: 'logout',
    label: t('Log Out'),
  },
});

export default menuLinks;
