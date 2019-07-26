import React from 'react';
import routes from '../../constants/routes';
import MenuItems from './menuItems';
import UserAccount from './accountMenu/userAccount';
import NavigationButtons from './navigationButtons';
import Piwik from '../../utils/piwik';
import menuLinks from './constants';
import Dropdown from '../toolbox/dropdown/dropdown';
import SearchBar from '../searchBar';
import Network from './network';
import styles from './topBar.css';

import OutsideClickHandler from '../toolbox/outsideClickHandler';
import Icon from '../toolbox/icon';
import Autologout from './autologout/autologout';

class TopBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      openDropdown: '',
    };

    this.searchInput = null;

    this.onLogout = this.onLogout.bind(this);
    this.handleSearchDropdown = this.onHandleClick.bind(this, 'search');
    this.handleAccountDropdown = this.onHandleClick.bind(this, 'account');
    this.onCountdownComplete = this.onCountdownComplete.bind(this);
  }

  onLogout() {
    Piwik.trackingEvent('Header', 'button', 'Open logout dialog');
    this.props.logOut();
    this.props.history.replace(`${routes.dashboard.path}`);
  }

  onHandleClick(name) {
    const { openDropdown } = this.state;

    if (name === 'search' && openDropdown !== name) {
      setTimeout(() => this.searchInput.focus(), 150);
    }
    this.setState({
      openDropdown: openDropdown === name ? '' : name,
    });
  }

  /* istanbul ignore next */
  onCountdownComplete() {
    this.props.logOut();
    this.props.history.replace(routes.login.path);
  }

  /* istanbul ignore next */
  isTimerEnabled() {
    const { autoLogout, account } = this.props;

    return autoLogout
      && account.expireTime
      && account.expireTime !== 0
      && account.passphrase
      && account.passphrase.length > 0;
  }

  render() {
    const {
      t, account, history, network, token, settingsUpdated,
      closeDialog, resetTimer, setActiveDialog,
    } = this.props;
    const { openDropdown } = this.state;

    const items = menuLinks(t);
    const isUserLogout = !!(Object.keys(account).length === 0 || account.afterLogout);

    return (
      <div className={`${styles.wrapper} top-bar`}>
        <div>
          <div className={styles.logo}>
            <Icon name="liskLogo" className="topbar-logo" />
          </div>

          <NavigationButtons
            account={account}
            history={history}
          />

          <MenuItems
            token={token}
            isUserLogout={isUserLogout}
            items={items}
            location={this.props.location}
          />
        </div>
        <div>
          <Network
            token={token.active}
            network={network}
            t={t}
          />

          {this.isTimerEnabled() ? (
            <div className={styles.timer}>
              <Autologout
                onCountdownComplete={this.onCountdownComplete}
                account={account}
                closeDialog={closeDialog}
                history={history}
                resetTimer={resetTimer}
                setActiveDialog={setActiveDialog}
                t={t}
              />
            </div>
          ) : null}


          <UserAccount
            token={token}
            className={styles.userAccount}
            account={account}
            isDropdownEnable={openDropdown === 'account'}
            onDropdownToggle={this.handleAccountDropdown}
            onLogout={this.onLogout}
            settingsUpdated={settingsUpdated}
            isUserLogout={isUserLogout}
            t={t}
          />

          {token.active !== 'BTC'
            ? (
              <OutsideClickHandler
                className={`${styles.searchButton} search-section`}
                onOutsideClick={this.handleSearchDropdown}
                disabled={openDropdown !== 'search'}
                wrapper={<label />}
              >
                <Icon
                  onClick={this.handleSearchDropdown}
                  className="search-icon"
                  name={`search_icon_${openDropdown === 'search' ? 'active' : 'inactive'}`}
                />
                <Dropdown
                  showDropdown={openDropdown === 'search'}
                  className={`${styles.searchDropdown}`}
                  showArrow={false}
                >
                  <SearchBar
                    setSearchBarRef={(node) => { this.searchInput = node; }}
                    history={this.props.history}
                    onSearchClick={this.handleSearchDropdown}
                  />
                </Dropdown>
              </OutsideClickHandler>
            )
            : null }
        </div>
      </div>
    );
  }
}

export default TopBar;
