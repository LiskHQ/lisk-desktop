import React, { useState } from 'react';
import DropdownButton from '@theme/DropdownButton';
import { TertiaryButton } from '@theme/buttons';
import Icon from '@theme/Icon';
import Tooltip from '@theme/Tooltip/tooltip';
import { truncateAddress, truncateAccountName } from '@wallet/utils/account';
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

  const truncatedAcctName = name.length > 10 ? truncateAccountName(name) : name;

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
            {name.length > 10 ? (
              <Tooltip
                size="s"
                position="bottom"
                tooltipClassName={styles.nameTooltip}
                content={
                  <span className={styles.name}>
                    {truncatedAcctName}
                    {true && <Icon className={styles.walletIcon} name="hardwareWalletIcon" />}
                  </span>
                }
              >
                <span>{name}</span>
              </Tooltip>
            ) : (
              <span className={styles.name}>
                {truncatedAcctName}
                {isHW && <Icon className={styles.walletIcon} name="hardwareWalletIcon" />}
              </span>
            )}
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
