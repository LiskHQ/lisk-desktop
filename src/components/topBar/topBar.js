import React from 'react';
<<<<<<< HEAD
import { Link } from 'react-router-dom';
=======
>>>>>>> :nail_care: Update css file for menuItems, searchBar and userAccount
import routes from '../../constants/routes';
import MenuItems from './menuItems';
import SearchBar from '../searchBar';
import UserAccount from './userAccount';
<<<<<<< HEAD
import Piwik from '../../utils/piwik';
import Options from '../dialog/options';
import { menuLinks } from './constants';
import styles from './topBar.css';

import liskLogo from '../../assets/images/lisk-logo-v2.svg';

class TopBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isDropdownEnable: false,
    };

    this.confirLogout = this.confirLogout.bind(this);
    this.onLogout = this.onLogout.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.setDropdownRef = this.setDropdownRef.bind(this);
  }

  confirLogout() {
    this.props.logOut();
    this.props.closeDialog();
    this.props.history.replace(`${routes.dashboard.path}`);
  }

  onLogout() {
    Piwik.trackingEvent('Header', 'button', 'Open logout dialog');

    this.props.setActiveDialog({
      childComponent: Options,
      childComponentProps: {
        title: this.props.t('Logout'),
        text: this.props.t('After logging out of your account you will be able to access the Dashboard, Settings and Search.'),
        firstButton: {
          text: this.props.t('Cancel'),
          onClickHandler: this.props.closeDialog,
        },
        secondButton: {
          text: this.props.t('Logout'),
          onClickHandler: this.confirLogout,
        },
      },
    });
  }

  handleClick() {
    if (!this.state.isDropdownEnable) {
      document.addEventListener('click', this.handleClickOutside, false);
    } else {
      document.removeEventListener('click', this.handleClickOutside, false);
    }

    this.setState(prevState => ({ isDropdownEnable: !prevState.isDropdownEnable }));
  }

  // istanbul ignore next
  handleClickOutside(e) {
    if (this.dropdownRef && this.dropdownRef.contains(e.target)) return;
    this.handleClick();
  }

  setDropdownRef(node) {
    this.dropdownRef = node;
  }

  render() {
    const { t, showDelegate, account } = this.props;

    const items = showDelegate
      ? menuLinks
      : menuLinks.filter(item => item.id !== 'delegates');

    const isUserLogout = Object.keys(account).length === 0 || account.afterLogout;

=======
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

>>>>>>> :nail_care: Update css file for menuItems, searchBar and userAccount
    return (
      <div className={styles.wrapper}>
        <div className={styles.elements}>
          <img src={liskLogo} />
          <MenuItems
<<<<<<< HEAD
            isUserLogout={isUserLogout}
            items={items}
            location={this.props.location}
            t={t}
          />
          <SearchBar />

          {
            !isUserLogout &&
              <UserAccount
                account={this.props.account}
                isDropdownEnable={this.state.isDropdownEnable}
                onDropdownToggle={this.handleClick}
                onLogout={this.onLogout}
                setDropdownRef={this.setDropdownRef}
                t={t}
              />
          }

          {
            isUserLogout &&
              <div className={styles.signIn}>
                <p>{t('Welcome back')}</p>
                <span>
                  <Link to={'/'}>{t('Sign in')}</Link>
                  {t('for full access')}
                </span>
              </div>
          }
=======
            items={items}
            t={t}
            location={this.props.location}
          />
          <SearchBar />
          <UserAccount
            account={this.props.account}
            t={t}
          />
>>>>>>> :nail_care: Update css file for menuItems, searchBar and userAccount
        </div>
      </div>
    );
  }
}

<<<<<<< HEAD
export default TopBar;
=======
export default MainMenu;
>>>>>>> :nail_care: Update css file for menuItems, searchBar and userAccount
