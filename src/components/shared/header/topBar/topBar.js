import React from 'react';
import routes from '../../../../constants/routes';
import MenuItems from './menuItems';
import UserAccount from './accountMenu/userAccount';
import NavigationButtons from './navigationButtons';
import Piwik from '../../../../utils/piwik';
import menuLinks from './constants';
import SearchBar from '../../searchBar';
import Network from './network';
import networks from '../../../../constants/networks';
import DropdownButton from '../../../toolbox/dropdownButton';
import { SecondaryButton } from '../../../toolbox/buttons/button';
import styles from './topBar.css';
import Icon from '../../../toolbox/icon';
import Autologout from './autologout/autologout';

class TopBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      openDropdown: '',
    };

    this.searchInput = null;

    this.onLogout = this.onLogout.bind(this);
    this.handleSeachDropdownToggle = this.handleSeachDropdownToggle.bind(this);
    this.onCountdownComplete = this.onCountdownComplete.bind(this);
    this.setChildRef = this.setChildRef.bind(this);
  }

  onLogout() {
    const {
      logOut, history, settings, networkSet, network,
    } = this.props;

    Piwik.trackingEvent('Header', 'button', 'Open logout dialog');
    logOut();
    history.replace(`${routes.dashboard.path}`);

    // istanbul ignore else
    if (!settings.showNetwork && network.name !== networks.mainnet.name) {
      networkSet(networks.mainnet);
    }
  }

  handleSeachDropdownToggle() {
    setTimeout(() => this.searchInput.focus(), 150);
    this.childRef.toggleDropdown();
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

  setChildRef(node) {
    this.childRef = node;
  }

  render() {
    const {
      t,
      account,
      history,
      network,
      token,
      settingsUpdated,
      resetTimer,
    } = this.props;
    const isSearchActive = (this.childRef && this.childRef.state.shownDropdown) || false;
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
                history={history}
                resetTimer={resetTimer}
                t={t}
              />
            </div>
          ) : null}


          <UserAccount
            token={token}
            className={styles.userAccount}
            account={account}
            onLogout={this.onLogout}
            settingsUpdated={settingsUpdated}
            isUserLogout={isUserLogout}
            t={t}
          />

          {token.active !== 'BTC'
            ? (
              <DropdownButton
                buttonClassName={`${styles.searchButton} search-icon`}
                className={`${styles.searchDropdown} search-section`}
                buttonLabel={(
                  <Icon name={`searchIcon${isSearchActive === 'search' ? 'Active' : 'Inactive'}`} />
                )}
                ButtonComponent={SecondaryButton}
                align="right"
                ref={this.setChildRef}
              >
                <SearchBar
                  setSearchBarRef={(node) => { this.searchInput = node; }}
                  history={this.props.history}
                  onSearchClick={this.handleSeachDropdownToggle}
                />
              </DropdownButton>
            )
            : null }
        </div>
      </div>
    );
  }
}

export default TopBar;
