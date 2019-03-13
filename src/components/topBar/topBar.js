import React from 'react';
import { Link } from 'react-router-dom';
import routes from '../../constants/routes';
import MenuItems from './menuItems';
import SearchBar from '../searchBar';
import UserAccount from './userAccount';
import Piwik from '../../utils/piwik';
import menuLinks from './constants';
import styles from './topBar.css';

import liskLogo from '../../assets/images/lisk-logo-v2.svg';

class TopBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isDropdownEnable: false,
    };

    this.onLogout = this.onLogout.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.setDropdownRef = this.setDropdownRef.bind(this);
  }

  onLogout() {
    Piwik.trackingEvent('Header', 'button', 'Open logout dialog');
    this.props.logOut();
    this.props.history.replace(`${routes.dashboard.path}`);
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

    const menuItems = menuLinks(t);

    const items = showDelegate
      ? menuItems
      : menuItems.filter(item => item.id !== 'delegates');

    const isUserLogout = Object.keys(account).length === 0 || account.afterLogout;

    const isUserDataFetched = (account.balance) || account.balance === 0;

    return (
      <div className={styles.wrapper}>
        <div className={styles.elements}>
          <img src={liskLogo} />
          <MenuItems
            isUserLogout={isUserLogout}
            items={items}
            location={this.props.location}
            t={t}
          />
          <SearchBar />

          {
            isUserDataFetched ?
              <UserAccount
                account={this.props.account}
                isDropdownEnable={this.state.isDropdownEnable}
                onDropdownToggle={this.handleClick}
                onLogout={this.onLogout}
                setDropdownRef={this.setDropdownRef}
                t={t}
              />
              : null
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
        </div>
      </div>
    );
  }
}

export default TopBar;
