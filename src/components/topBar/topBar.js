import React from 'react';
import { Link } from 'react-router-dom';
import routes from '../../constants/routes';
import MenuItems from './menuItems';
import UserAccount from './userAccount';
import NavigationButton from './navigationButtons';
import Piwik from '../../utils/piwik';
import menuLinks from './constants';
import svg from '../../utils/svgIcons';
import DropdownV2 from '../toolbox/dropdownV2/dropdownV2';
import SearchBarV2 from '../searchBarV2';
import styles from './topBar.css';

import liskLogo from '../../assets/images/lisk-logo-v2.svg';

class TopBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      openDropdown: '',
    };

    this.elementsRef = {
      avatar: null,
      search: null,
      searchInput: null,
    };

    this.onLogout = this.onLogout.bind(this);
    this.onHandleClick = this.onHandleClick.bind(this);
    this.onHandleClickOutside = this.onHandleClickOutside.bind(this);
    this.setElementsRefs = this.setElementsRefs.bind(this);
  }

  onLogout() {
    Piwik.trackingEvent('Header', 'button', 'Open logout dialog');
    this.props.logOut();
    this.props.history.replace(`${routes.dashboard.path}`);
  }

  onHandleClick(name) {
    if (this.state.openDropdown !== name) {
      document.addEventListener('click', this.onHandleClickOutside, false);
      if (name === 'search') setTimeout(() => { this.elementsRef.searchInput.focus(); }, 150);
    } else {
      document.removeEventListener('click', this.onHandleClickOutside, false);
    }

    this.setState(prevState => ({
      openDropdown: prevState.openDropdown === name ? '' : name,
    }));
  }

  setElementsRefs(node) {
    const elementName = node && node.dataset && node.dataset.name;

    this.elementsRef = elementName
      ? {
        ...this.elementsRef,
        [elementName]: node,
      }
      : this.elementsRef;
  }

  // istanbul ignore next
  onHandleClickOutside(e) {
    const { openDropdown } = this.state;
    const elementRef = this.elementsRef[openDropdown];

    if (elementRef && elementRef.contains(e.target)) return;
    this.onHandleClick(openDropdown);
  }

  render() {
    const { t, showDelegate, account } = this.props;
    const { openDropdown } = this.state;

    const menuItems = menuLinks(t);
    const items = showDelegate
      ? menuItems
      : menuItems.filter(item => item.id !== 'delegates');
    const isUserLogout = Object.keys(account).length === 0 || account.afterLogout;
    const isUserDataFetched = (account.balance) || account.balance === 0;

    return (
      <div className={`${styles.wrapper} top-bar`}>
        <div className={styles.elements}>
          <img src={liskLogo} className={'topbar-logo'}/>

          <NavigationButton
            account={this.props.account}
            history={this.props.history}
          />

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
                isDropdownEnable={openDropdown === 'avatar'}
                onDropdownToggle={this.onHandleClick}
                onLogout={this.onLogout}
                setDropdownRef={this.setElementsRefs}
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

          <div className={`${styles.searchButton} search-section`}
            data-name={'search'}
            ref={this.setElementsRefs}
          >
            <img
              className={'search-icon'}
              src={openDropdown === 'search' ? svg.search_icon_active : svg.search_icon_inactive}
              onClick={() => this.onHandleClick('search')}
            />

            <DropdownV2
              showDropdown={openDropdown === 'search'}
              className={`${styles.searchDropdown}`}>
              <SearchBarV2
                setSearchBarRef={this.setElementsRefs}
                history={this.props.history}
                onSearchClick={this.onHandleClick}
              />
            </DropdownV2>
          </div>
        </div>
      </div>
    );
  }
}

export default TopBar;
