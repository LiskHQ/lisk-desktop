import React from 'react';
import { Link } from 'react-router-dom';
import AccountVisual from '../accountVisual';
import CopyToClipboard from '../copyToClipboard';
import LiskAmount from '../liskAmount';
import DropdownV2 from '../toolbox/dropdownV2/dropdownV2';
import { dropdownLinks } from './constants';
import styles from './userAccount.css';

const UserAccount = props => (
  <div className={`${styles.wrapper} user-account`}>
    <div className={styles.information}>
      <CopyToClipboard
        value={props.account.address}
        className={`${styles.copyAddress} account-information-address`}
        copyClassName={styles.copy}
      />
      <div className={`${styles.balance} balance`}>
        <LiskAmount val={props.account.balance} />
        <small>{props.t(' LSK')}</small>
      </div>
    </div>
    <div
      className={`${styles.avatar} user-avatar`}
      onClick={() => props.onDropdownToggle()}
    >
      <span
        className={styles.onAvatar}
        ref={node => props.setDropdownRef(node)}
      >
        <AccountVisual
          address={props.account.address || ''}
          size={40}
        />
      </span>

      <DropdownV2 showDropdown={props.isDropdownEnable}>
        <Link
          id={dropdownLinks.settings.id}
          to={dropdownLinks.settings.path}
          className={styles.dropdownOption}
        >
          <img src={dropdownLinks.settings.icon} className={styles.defaultIcon} />
          <img src={dropdownLinks.settings.icon_active} className={styles.activeIcon} />
          <span>{props.t(dropdownLinks.settings.label)}</span>
        </Link>

        <span
          className={`${styles.dropdownOption} logout`}
          onClick={() => props.onLogout()}
          >
          <img src={dropdownLinks.logout.icon} className={styles.defaultIcon}/>
          <img src={dropdownLinks.logout.icon_active} className={styles.activeIcon}/>
          <span>{props.t(dropdownLinks.logout.label)}</span>
        </span>
      </DropdownV2>
    </div>
  </div>
);



export default UserAccount;
