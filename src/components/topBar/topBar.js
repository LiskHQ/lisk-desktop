import React from 'react';
import { Link } from 'react-router-dom';
import routes from '../../constants/routes';
import MenuItems from './menuItems';
import UserAccount from './userAccount';
import Piwik from '../../utils/piwik';
import { menuLinks } from './constants';
import svg from '../../utils/svgIcons';
import DropdownV2 from '../toolbox/dropdownV2/dropdownV2';
import SearchBarV2 from '../searchBarV2';
import styles from './topBar.css';

import liskLogo from '../../assets/images/lisk-logo-v2.svg';

class TopBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isDropdownEnable: false,
      isSearchDropdownEnable: false,
    };

    this.onLogout = this.onLogout.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.setDropdownRef = this.setDropdownRef.bind(this);
    this.setSearchBarRef = this.setSearchBarRef.bind(this);
    this.onSearchClick = this.onSearchClick.bind(this);
    this.onSearchClickOutside = this.onSearchClickOutside.bind(this);
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

  setSearchBarRef(node) {
    this.searchBarRef = node;
  }

  onSearchClick() {
    if (!this.state.isSearchDropdownEnable) {
      document.addEventListener('click', this.onSearchClickOutside, false);
    } else {
      document.removeEventListener('click', this.onSearchClickOutside, false);
    }

    this.setState(prevState => ({ isSearchDropdownEnable: !prevState.isSearchDropdownEnable }));
  }

  onSearchClickOutside(e) {
    if (this.searchBarRef && this.searchBarRef.contains(e.target)) return;
    this.onSearchClick();
  }

  render() {
    const { t, showDelegate, account } = this.props;
    const { isSearchDropdownEnable } = this.state;

    const items = showDelegate
      ? menuLinks
      : menuLinks.filter(item => item.id !== 'delegates');

    const isUserLogout = Object.keys(account).length === 0 || account.afterLogout;
    const isUserDataFetched = (account.balance) || account.balance === 0;

    return (
      <div className={`${styles.wrapper} top-bar`}>
        <div className={styles.elements}>
          <img src={liskLogo} />
          <MenuItems
            isUserLogout={isUserLogout}
            items={items}
            location={this.props.location}
            t={t}
          />

          {
            isUserDataFetched ?
              <UserAccount
                className={styles.userAccount}
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

          <div className={styles.searchButton}>
            <img
              onClick={this.onSearchClick}
              src={isSearchDropdownEnable ? svg.search_icon_active : svg.search_icon_inactive}
            />

            <DropdownV2
              showDropdown={this.state.isSearchDropdownEnable}
              className={`${styles.searchDropdown}`}>
              <SearchBarV2
                history={this.props.history}
                setSearchBarRef={this.setSearchBarRef}
              />
            </DropdownV2>
          </div>
        </div>
      </div>
    );
  }
}

export default TopBar;
