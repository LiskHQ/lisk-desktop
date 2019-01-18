import React from 'react';
import routes from '../../constants/routes';
import MenuItems from './menuItems';
// import Piwik from '../../utils/piwik';
import styles from './mainMenu.css';

import liskLogo from '../../assets/images/lisk-logo-v2.svg';
import dashboardIcon from '../../assets/images/icons-v2/dashboard.svg';
import walletIcon from '../../assets/images/icons-v2/wallet.svg';
import delegatesIcon from '../../assets/images/icons-v2/delegates.svg';

class MainMenu extends React.Component {
  render() {
    const { t, showDelegate } = this.props;

    const items = [
      {
        icon: dashboardIcon,
        id: 'dashboard',
        label: t('Dashboard'),
        path: routes.dashboard.path,
      },
      {
        icon: walletIcon,
        id: 'wallet',
        label: t('My Wallet'),
        path: routes.wallet.path,
      },
      {
        icon: delegatesIcon,
        id: 'delegates',
        label: t('Delegates'),
        path: routes.delegates.path,
      },
    ];

    return (
      <div className={styles.wrapper}>
        <img src={liskLogo} />
        <MenuItems items={items} />
        {
          showDelegate && 'yes'
        }
      </div>
    );
  }
}

export default MainMenu;
