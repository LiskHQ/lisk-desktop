import React from 'react';
import routes from '../../constants/routes';
import MenuItems from './menuItems';
import SearchBar from '../searchBar';
import UserAccount from './userAccount';
// import Piwik from '../../utils/piwik';
import styles from './topBar.css';

import liskLogo from '../../assets/images/lisk-logo-v2.svg';
import dashboardIcon from '../../assets/images/icons-v2/dashboard.svg';
import dashboardActiveIcon from '../../assets/images/icons-v2/dashboard-active.svg';
import walletIcon from '../../assets/images/icons-v2/wallet.svg';
import walletActiveIcon from '../../assets/images/icons-v2/wallet-active.svg';
import delegatesIcon from '../../assets/images/icons-v2/delegates.svg';
import delegatesActiveIcon from '../../assets/images/icons-v2/delegates-active.svg';

class MainMenu extends React.Component {
  render() {
    const { t, showDelegate } = this.props;

    const items = [
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
        id: 'wallet',
        label: 'My Wallet',
        path: routes.wallet.path,
      },
    ];

    if (showDelegate) {
      items.push({
        icon: delegatesIcon,
        iconActive: delegatesActiveIcon,
        id: 'delegates',
        label: 'Delegates',
        path: routes.delegates.path,
      });
    }

    return (
      <div className={styles.wrapper}>
        <div className={styles.elements}>
          <img src={liskLogo} />
          <MenuItems
            items={items}
            t={t}
            location={this.props.location}
          />
          <SearchBar />
          <UserAccount
            account={this.props.account}
            t={t}
          />
        </div>
      </div>
    );
  }
}

export default MainMenu;
