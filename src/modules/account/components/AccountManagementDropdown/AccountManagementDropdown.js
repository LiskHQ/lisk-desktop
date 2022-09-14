import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import DropdownButton from 'src/theme/DropdownButton';
import { TertiaryButton } from 'src/theme/buttons';
import Icon from 'src/theme/Icon';
import DialogLink from 'src/theme/dialog/link';
import { ACCOUNT_MENU } from '@account/const';
import { truncateAddress } from '@wallet/utils/account';
import styles from './AccountManagementDropdown.css';

const AccountManagementDropdown = ({ currentAccount }) => {
  const { t } = useTranslation();
  const { name, address } = currentAccount.metadata;

  return (
    <DropdownButton
      className={styles.dropDownMenu}
      wrapperClassName={styles.wrapper}
      ButtonComponent={TertiaryButton}
      buttonClassName={`account-management-dropdown ${styles.dropdownButton}`}
      buttonLabel={
        <>
          <div className={styles.account}>
            <span className={styles.name}>{name}</span>
            <span className={styles.address}>{truncateAddress(address)}</span>
          </div>
          <Icon name="dropdownArrowIcon" />
        </>
      }
      size="m"
    >
      <ul className={styles.dropDownMenuList}>
        {ACCOUNT_MENU.map(({ path, icon, label, component }) => (
          <li key={label}>
            {component ? (
              <DialogLink component={component}>
                <Icon name={icon} />
                {t(label)}
              </DialogLink>
            ) : (
              <Link to={path}>
                <Icon name={icon} />
                {t(label)}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </DropdownButton>
  );
};

export default AccountManagementDropdown;
