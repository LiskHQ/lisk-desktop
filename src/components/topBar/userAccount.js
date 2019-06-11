import React from 'react';
import { Link } from 'react-router-dom';
import LiskAmount from '../liskAmount';
import DropdownV2 from '../toolbox/dropdownV2/dropdownV2';
import { dropdownLinks } from './constants';
import styles from './userAccount.css';
import OutsideClickHandler from '../toolbox/outsideClickHandler';
import Icon from '../toolbox/icon';

const UserAccount = (props) => {
  const dropdownOptions = dropdownLinks(props.t);

  return (
    <OutsideClickHandler
      className={`${styles.wrapper} user-account`}
      onClick={() => props.onDropdownToggle('avatar')}
      onOutsideClick={() => props.onDropdownToggle('avatar')}
      disabled={!props.isDropdownEnable}
    >
      <div className={styles.accountInfo} ref={props.setDropdownRef}>
        <Icon name='btcIcon' />
        <div>
          <p>{props.t('{{token}} Wallet', { token: 'Bitcoin' })}</p>
          <span>
            <LiskAmount val={props.account.info.LSK.balance}/> BTC
          </span>
        </div>
      </div>
      <DropdownV2
        showArrow={false}
        className={styles.dropdown}
        showDropdown={props.isDropdownEnable}
      >
        <Link
          id={dropdownOptions.settings.id}
          to={dropdownOptions.settings.path}
          className={styles.dropdownOption}
        >
          <img src={dropdownOptions.settings.icon} className={styles.defaultIcon} />
          <img src={dropdownOptions.settings.icon_active} className={styles.activeIcon} />
          <span>{dropdownOptions.settings.label}</span>
        </Link>

        <span
          className={`${styles.dropdownOption} logout`}
          onClick={props.onLogout}
        >
          <img src={dropdownOptions.logout.icon} className={styles.defaultIcon}/>
          <img src={dropdownOptions.logout.icon_active} className={styles.activeIcon}/>
          <span>{dropdownOptions.logout.label}</span>
        </span>
      </DropdownV2>
    </OutsideClickHandler>
  );
};

export default UserAccount;
