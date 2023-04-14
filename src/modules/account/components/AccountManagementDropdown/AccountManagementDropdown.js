import React, { useState } from 'react';
import DropdownButton from 'src/theme/DropdownButton';
import { TertiaryButton } from 'src/theme/buttons';
import Icon from 'src/theme/Icon';
import { truncateAddress } from '@wallet/utils/account';
import AccountMenuListing from '@account/components/AccountMenuListing/AccountMenuListing';
import WalletVisual from '@wallet/components/walletVisual';
import styles from './AccountManagementDropdown.css';

const AccountManagementDropdown = ({ currentAccount, onMenuClick }) => {
  const { name, address, isHW } = currentAccount.metadata;
  const [isDropdownShown, setIsDropdownShown] = useState(false);

  const handleDismissMenu = () => {
    setIsDropdownShown(false);
  };
  const handleOpenMenu = () => {
    setIsDropdownShown(true);
  };

  return (
    <DropdownButton
      className={styles.dropDownMenu}
      wrapperClassName={styles.wrapper}
      ButtonComponent={TertiaryButton}
      isDropdownShown={isDropdownShown}
      onDropdownOpen={handleOpenMenu}
      buttonClassName={`account-management-dropdown ${styles.dropdownButton}`}
      buttonLabel={
        <div className={styles.accountWrapper}>
          <WalletVisual address={address} size={32} />
          <div className={styles.account}>
            <span className={styles.name}>
              {name}
              {isHW && <Icon className={styles.walletIcon} name="hardwareWalletIcon" />}
            </span>
            <span className={styles.address}>{truncateAddress(address)}</span>
          </div>
          <Icon name="dropdownArrowIcon" />
        </div>
      }
      size="m"
      trackDropdownState={onMenuClick}
    >
      <AccountMenuListing className={styles.dropDownMenuList} onItemClicked={handleDismissMenu} />
    </DropdownButton>
  );
};

export default AccountManagementDropdown;
