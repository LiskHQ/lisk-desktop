import React from 'react';
import { Link } from 'react-router-dom';
import routes from '../../constants/routes';
import MenuItems from './menuItems';
import UserAccount from './userAccount';
import NavigationButtons from './navigationButtons';
import Piwik from '../../utils/piwik';
import menuLinks from './constants';
import DropdownV2 from '../toolbox/dropdownV2/dropdownV2';
import SearchBarV2 from '../searchBarV2';
import Network from './network';
import styles from './topBar.css';

import OutsideClickHandler from '../toolbox/outsideClickHandler';
import { PrimaryButtonV2 } from '../toolbox/buttons/button';
import Icon from '../toolbox/icon';

class TopBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      openDropdown: '',
    };

    this.onLogout = this.onLogout.bind(this);
    this.onHandleClick = this.onHandleClick.bind(this);
  }

  onLogout() {
    Piwik.trackingEvent('Header', 'button', 'Open logout dialog');
    this.props.logOut();
    this.props.history.replace(`${routes.dashboard.path}`);
  }

  onHandleClick(name) {
    this.setState(prevState => ({
      openDropdown: prevState.openDropdown === name ? '' : name,
    }));
  }

  render() {
    const {
      t, account, history, peers,
    } = this.props;
    const { openDropdown } = this.state;

    const items = menuLinks(t);
    const isUserLogout = !!(Object.keys(account).length === 0 || account.afterLogout);
    const isUserDataFetched = !!account.balance || account.balance === 0;

    return (
      <div className={`${styles.wrapper} top-bar`}>
        <div>
          <div className={styles.logo}>
            <Icon name={'liskLogo'} className={'topbar-logo'} />
          </div>

          <NavigationButtons
            account={account}
            history={history}
          />

          <MenuItems
            isUserLogout={isUserLogout}
            items={items}
            location={this.props.location}
            t={t}
          />
        </div>
        <div>
          {!isUserLogout
          ? <Network
              peers={peers}
              t={t}
            />
          : null}
          {
            isUserDataFetched
              ? <UserAccount
                className={styles.userAccount}
                account={this.props.account}
                isDropdownEnable={openDropdown === 'avatar'}
                onDropdownToggle={this.onHandleClick}
                onLogout={this.onLogout}
                t={t}
              />
            : isUserLogout &&
              <div className={styles.signIn}>
                <Link to={routes.loginV2.path}>
                  <PrimaryButtonV2 className={'small'}>
                    {t('Sign in')}
                  </PrimaryButtonV2>
                </Link>
              </div>
          }

          <OutsideClickHandler
            className={`${styles.searchButton} search-section`}
            onOutsideClick={() => this.onHandleClick('search')}
            onClick={() => this.onHandleClick('search')}
            disabled={openDropdown !== 'search'}
            wrapper={<label />}
          >
            <Icon
              className={'search-icon'}
              name={`search_icon_${openDropdown === 'search' ? 'active' : 'inactive'}`}
            />
            <DropdownV2
              showDropdown={openDropdown === 'search'}
              className={`${styles.searchDropdown}`}
            >
              <SearchBarV2
                history={this.props.history}
                onSearchClick={this.onHandleClick}
              />
            </DropdownV2>
          </OutsideClickHandler>
        </div>
      </div>
    );
  }
}

export default TopBar;
