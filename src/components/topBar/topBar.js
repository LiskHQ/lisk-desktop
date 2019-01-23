import React from 'react';
import routes from '../../constants/routes';
import MenuItems from './menuItems';
import SearchBar from '../searchBar';
import UserAccount from './userAccount';
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
    this.onDropdownToggle = this.onDropdownToggle.bind(this);
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

    this.onDropdownToggle();
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

  onDropdownToggle() {
    this.setState({ isDropdownEnable: !this.state.isDropdownEnable });
  }

  handleClick() {
    if (!this.state.isDropdownEnable) {
      document.addEventListener('click', this.handleClickOutside, false);
    } else {
      document.removeEventListener('click', this.handleClickOutside, false);
    }

    this.setState(prevState => ({ isDropdownEnable: !prevState.isDropdownEnable }));
  }

  handleClickOutside(e) {
    if (this.dropdownRef && this.dropdownRef.contains(e.target)) return;
    this.handleClick();
  }

  setDropdownRef(node) {
    this.dropdownRef = node;
  }

  render() {
    const { t, showDelegate } = this.props;

    const items = showDelegate
      ? menuLinks
      : menuLinks.filter(item => item.id !== 'delegates');

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
            onLogout={this.onLogout}
            onDropdownToggle={this.handleClick}
            isDropdownEnable={this.state.isDropdownEnable}
            setDropdownRef={this.setDropdownRef}
            t={t}
          />
        </div>
      </div>
    );
  }
}

export default TopBar;
