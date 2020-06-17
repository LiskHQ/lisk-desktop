import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import routes from '../../../../constants/routes';
import NavigationButtons from './navigationButtons';
import Piwik from '../../../../utils/piwik';
import SearchBar from '../../searchBar';
import Network from './network';
import networks from '../../../../constants/networks';
import styles from './topBar.css';
import Icon from '../../../toolbox/icon';
import { settingsUpdated } from '../../../../actions/settings';

/**
 * Toggles boolean values on store.settings
 *
 * @param {String} setting The key to update in store.settings
 * @param {Array} icons [activeIconName, normalIconName]
 */
const Toggle = ({
  setting, icons,
}) => {
  const dispatch = useDispatch();
  const value = useSelector(state => state.settings[setting]);

  const toggle = () => {
    dispatch(settingsUpdated({ [setting]: !value }));
  };

  return (
    <Icon
      name={value ? icons[0] : icons[1]}
      className={styles.toggle}
      onClick={toggle}
    />
  );
};

const TokenSelector = ({ token, history }) => {
  const dispatch = useDispatch();
  const activeToken = useSelector(state => state.settings.token.active);

  const activateToken = () => {
    if (activeToken !== token) {
      dispatch(settingsUpdated({ token: { active: token } }));
      const { location, push } = history;
      if (location.pathname !== routes.wallet.path) {
        push(routes.wallet.path);
      }
    }
  };

  return (
    <Icon
      name={`${token.toLowerCase()}Icon`}
      className={`${styles.toggle} ${activeToken === token ? '' : styles.disabled}`}
      onClick={activateToken}
    />
  );
};

class TopBar extends React.Component {
  constructor(props) {
    super(props);
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
      resetTimer,
    } = this.props;
    const isSearchActive = (this.childRef && this.childRef.state.shownDropdown) || false;
    const isUserLogout = !!(Object.keys(account).length === 0 || account.afterLogout);
    return (
      <div className={`${styles.wrapper} top-bar`}>
        <div className={styles.group}>
          <Icon
            name="liskLogo"
            className={`${styles.logo} topbar-logo`}
          />
          <NavigationButtons
            account={account}
            history={history}
          />
          <Toggle
            setting="sideBarExpanded"
            icons={['toggleSidebarActive', 'toggleSidebar']}
          />
        </div>
        <div className={styles.group}>
          <TokenSelector token="LSK" history={history} />
          <TokenSelector token="BTC" history={history} />
          <Toggle
            setting="darkMode"
            icons={['lightMode', 'darkMode']}
          />
          <Toggle
            setting="discreetMode"
            icons={['discreetModeActive', 'discreetMode']}
          />
          <Network
            token={token.active}
            network={network}
            t={t}
          />
        </div>
      </div>
    );
  }
}

export default TopBar;
