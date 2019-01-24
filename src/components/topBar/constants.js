// istanbul ignore file
import routes from '../../constants/routes';
import dashboardIcon from '../../assets/images/icons-v2/dashboard.svg';
import dashboardActiveIcon from '../../assets/images/icons-v2/dashboard-active.svg';
import walletIcon from '../../assets/images/icons-v2/wallet.svg';
import walletActiveIcon from '../../assets/images/icons-v2/wallet-active.svg';
import delegatesIcon from '../../assets/images/icons-v2/delegates.svg';
import delegatesActiveIcon from '../../assets/images/icons-v2/delegates-active.svg';
import settingsIcon from '../../assets/images/icons-v2/settings.svg';
import settingsActiveIcon from '../../assets/images/icons-v2/settings-active.svg';
import logoutIcon from '../../assets/images/icons-v2/logout.svg';
import logoutActiveIcon from '../../assets/images/icons-v2/logout-active.svg';

export const menuLinks = [
  {
    icon: dashboardIcon,
    iconActive: dashboardActiveIcon,
    id: 'dashboard',
    label: 'Dashboard',
    path: routes.dashboard.path,
  },
  {
    icon: walletIcon,
    iconActive: walletActiveIcon,
    id: 'transactions',
    label: 'My Wallet',
    path: routes.wallet.path,
  },
  {
    icon: delegatesIcon,
    iconActive: delegatesActiveIcon,
    id: 'delegates',
    label: 'Delegates',
    path: routes.delegates.path,
  },
];

export const dropdownLinks = {
  settings: {
    label: 'Settings',
    path: `${routes.setting.path}`,
    id: 'settings',
    icon: settingsIcon,
    icon_active: settingsActiveIcon,
  },
  logout: {
    label: 'Log Out',
    id: 'logout',
    icon: logoutIcon,
    icon_active: logoutActiveIcon,
  },
};

