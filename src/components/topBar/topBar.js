import React from 'react';
import { Link } from 'react-router-dom';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import routes from '../../constants/routes';
import MenuItems from './menuItems';
import UserAccount from './userAccount';
import SearchBar from '../searchBar';
import UserDropdown from './userDropdown';
// import SearchDropdown from './searchDropdown';
import NavigationButton from './navigationButtons';
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
    // this.handleClick = this.handleClick.bind(this);
    // this.handleClickOutside = this.handleClickOutside.bind(this);
    // this.setDropdownRef = this.setDropdownRef.bind(this);
  }

  onLogout() {
    Piwik.trackingEvent('Header', 'button', 'Open logout dialog');
    this.props.logOut();
    this.props.history.replace(`${routes.dashboard.path}`);
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
        <div className={`${styles.elements} ${grid.row}`}>

          <div className={`${grid['col-xs-6']} ${grid.row} ${styles.leftTopBar}`}>
            <div className={grid['col-xs-2']}>
              <img src={liskLogo} />
            </div>

            <div className={`${grid['col-xs-2']} ${styles.navItem}`}>
              <NavigationButton
                account={this.props.account}
                history={this.props.history}
              />
            </div>

            <div className={`${grid['col-xs-6']}`}>
              <MenuItems
                isUserLogout={isUserLogout}
                items={items}
                location={this.props.location}
                t={t}
              />
            </div>
          </div>

          <div className={`${grid['col-xs-6']}  ${grid.row} ${styles.rightTopBar}`}>

          <div className={grid['col-xs-6']}>
            <SearchBar />
          </div>

          {
            isUserDataFetched ?
              <div className={grid['col-xs-4']}>
                <UserAccount
                  account={this.props.account}
                  isDropdownEnable={this.state.isDropdownEnable}
                  onDropdownToggle={this.handleClick}
                  onLogout={this.onLogout}
                  setDropdownRef={this.setDropdownRef}
                  t={t}
                />
              </div>
              : null
          }

          <UserDropdown
            account={this.props.account}
            isDropdownEnable={this.state.isDropdownEnable}
            onDropdownToggle={this.handleClick}
            onLogout={this.onLogout}
            setDropdownRef={this.setDropdownRef}
            t={t}
          />
          {/* <SearchDropdown
            account={this.props.account}
            isDropdownEnable={this.state.isDropdownEnable}
            onDropdownToggle={this.handleClick}
            onLogout={this.onLogout}
            setDropdownRef={this.setDropdownRef}
            t={t}
          /> */}
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
      </div>
    );
  }
}

export default TopBar;
