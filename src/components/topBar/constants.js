// istanbul ignore file
import routes from '../../constants/routes';
import svg from '../../utils/svgIcons';

export const menuLinks = [
  {
    icon: svg.dashboard_icon,
    iconActive: svg.dashboard_active_icon,
    id: 'dashboard',
    label: 'Dashboard',
    path: routes.dashboard.path,
  },
  {
    icon: svg.wallet_icon,
    iconActive: svg.wallet_active_icon,
    id: 'transactions',
    label: 'My Wallet',
    path: routes.wallet.path,
  },
  {
    icon: svg.delegates_icon,
    iconActive: svg.delegates_active_icon,
    id: 'delegates',
    label: 'Delegates',
    path: routes.delegates.path,
  },
];

export const dropdownLinks = {
  settings: {
    icon_active: svg.settings_active_icon,
    icon: svg.settings_icon,
    id: 'settings',
    label: 'Settings',
    path: `${routes.setting.path}`,
  },
  logout: {
    icon_active: svg.logout_active_icon,
    icon: svg.logout_icon,
    id: 'logout',
    label: 'Log Out',
  },
};

