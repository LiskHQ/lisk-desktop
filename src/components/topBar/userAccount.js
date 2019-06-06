import React from 'react';
import { Link } from 'react-router-dom';
import AccountVisual from '../accountVisual';
import CopyToClipboard from '../copyToClipboard';
import LiskAmount from '../liskAmount';
import DropdownV2 from '../toolbox/dropdownV2/dropdownV2';
import { dropdownLinks } from './constants';
import styles from './userAccount.css';
import OutsideClickHandler from '../toolbox/outsideClickHandler';

const UserAccount = (props) => {
  const dropdownOptions = dropdownLinks(props.t);

  return (
    <div className={`${styles.wrapper} user-account`}>
      <div className={styles.information}>
        <CopyToClipboard
          value={props.account.address}
          className={`${styles.copyAddress} account-information-address`}
          copyClassName={styles.copy}
        />
        <div className={`${styles.balance} balance`}>
          {Object.keys(props.account.info).map(key => (
            <React.Fragment key={key}>
              &nbsp; &nbsp;
              <LiskAmount val={props.account.info[key].balance}/>
              &nbsp;
              <small>{key}</small>
            </React.Fragment>
          ))}
        </div>
      </div>
      <OutsideClickHandler
        className={`${styles.avatar} user-avatar`}
        onClick={() => props.onDropdownToggle('avatar')}
        onOutsideClick={() => props.onDropdownToggle('avatar')}
        disabled={!props.isDropdownEnable}
      >
        <span
          className={styles.onAvatar}
          data-name={'avatar'}
          ref={props.setDropdownRef}
        >
          <AccountVisual
            address={props.account.address || ''}
            size={40}
          />
        </span>

        <DropdownV2 showArrow={false}
          className={styles.dropdown} showDropdown={props.isDropdownEnable}>
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
            onClick={() => props.onLogout()}
            >
            <img src={dropdownOptions.logout.icon} className={styles.defaultIcon}/>
            <img src={dropdownOptions.logout.icon_active} className={styles.activeIcon}/>
            <span>{dropdownOptions.logout.label}</span>
          </span>
        </DropdownV2>
      </OutsideClickHandler>
    </div>
  );
};

export default UserAccount;
