import React from 'react';
import { Link } from 'react-router-dom';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import DropdownV2 from '../toolbox/dropdownV2/dropdownV2';
import { dropdownLinks } from './constants';
import links from '../../constants/externalLinks';
import accountIcon from '../../assets/images/icons-v2/icon-account.svg';
import styles from './userAccount.css';
import topBarStyles from './topBar.css';

class UserDropdown extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isDropdownEnable: false,
    };

    this.handleClick = this.handleClick.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.setDropdownRef = this.setDropdownRef.bind(this);
  }

  setDropdownRef(node) {
    this.dropdownRef = node;
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

  render() {
    const dropdownOptions = dropdownLinks(this.props.t);

    return (
      <div
        className={`${grid['col-xs-2']} user-account ${topBarStyles.navItem} ${topBarStyles.menuItems}`}
        onClick={() => this.handleClick()}>
        <div className={`${styles.avatar} user-avatar`}>
          <span
            className={`${styles.onAvatar} ${this.state.isDropdownEnable ? styles.selected : ''}`}
            ref={node => this.setDropdownRef(node)}
          >
            <img src={accountIcon}/>
          </span>

          <DropdownV2
            showArrow
            className={styles.dropdown}
            showDropdown={this.state.isDropdownEnable}>
            <a
              target='_blank'
              href={links.helpCenter}
              rel='noopener noreferrer'
            >
              {this.props.t('Help Center')}
            </a>
            <div className={styles.space}>
              <div></div>
            </div>
            <Link
              id={dropdownOptions.settings.id}
              to={dropdownOptions.settings.path}
              className={styles.dropdownOption}
            >
              <img src={dropdownOptions.settings.icon} className={styles.defaultIcon} />
              <img src={dropdownOptions.settings.icon_active} className={styles.activeIcon} />
              <span>{dropdownOptions.settings.label}</span>
            </Link>
            <div/>
            <div className={styles.space}>
              <div></div>
            </div>
            <span
              className={`${styles.dropdownOption} logout`}
              onClick={() => this.props.onLogout()}
              >
              <img src={dropdownOptions.logout.icon} className={styles.defaultIcon}/>
              <img src={dropdownOptions.logout.icon_active} className={styles.activeIcon}/>
              <span>{dropdownOptions.logout.label}</span>
            </span>
          </DropdownV2>
        </div>
      </div>
    );
  }
}

export default UserDropdown;
