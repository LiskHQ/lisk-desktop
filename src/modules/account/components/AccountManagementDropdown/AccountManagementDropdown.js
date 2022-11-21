import React from 'react';
import DropdownButton from 'src/theme/DropdownButton';
import { TertiaryButton } from 'src/theme/buttons';
import Icon from 'src/theme/Icon';
import { truncateAddress } from '@wallet/utils/account';
import AccountMenuListing from '@account/components/AccountMenuListing/AccountMenuListing';
import styles from './AccountManagementDropdown.css';

const AccountManagementDropdown = ({ currentAccount, onMenuClick }) => {
  const { name, address } = currentAccount.metadata;

  return (
    <DropdownButton
      className={styles.dropDownMenu}
      wrapperClassName={styles.wrapper}
      ButtonComponent={TertiaryButton}
      buttonClassName={`account-management-dropdown ${styles.dropdownButton}`}
      buttonLabel={
        <div className={styles.accountWrapper}>
          <div className={styles.account}>
            <span className={styles.name}>{name}</span>
            <span className={styles.address}>{truncateAddress(address)}</span>
          </div>
          <Icon name="dropdownArrowIcon" />
        </div>
      }
      size="m"
      trackDropdownState={onMenuClick}
    >
      <AccountMenuListing className={styles.dropDownMenuList} />
    </DropdownButton>
  );
};

export default AccountManagementDropdown;
