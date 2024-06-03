import React, { useState } from 'react';
import Icon from 'src/theme/Icon';
import AccountManagementDropdown from '@account/components/AccountManagementDropdown';
import LightDarkToggle from 'src/modules/settings/components/lightDarkModeToggle';
import ApplicationManagementDropDown from '@blockchainApplication/manage/components/NetworkApplicationDropDownButton';
import { useCurrentAccount } from '@account/hooks';
import { HardwareWalletStatus } from '@hardwareWallet/components/HardwareWalletStatus';
import { isEmpty } from 'src/utils/helpers';
import NavigationButtons from '@common/components/bars/topBar/navigationButtons';
import styles from './topBar.css';

const TopBar = ({ history }) => {
  const [currentAccount] = useCurrentAccount();
  const [menuOpen, setMenuOpen] = useState(false);


  const onMenuClick = (menuOpenStatus) => {
    setMenuOpen(menuOpenStatus);
  };

  return (
    <div className={`${styles.wrapper} top-bar`}>
      <div className={styles.group}>
        <div className={`${styles.section} ${menuOpen ? styles.menuOpen : ''} user-menu-section`}>
          <Icon name="liskLogoWhiteNormalized" className={`${styles.logo} topbar-logo`} />
          {!isEmpty(currentAccount) ? (
            <AccountManagementDropdown currentAccount={currentAccount} onMenuClick={onMenuClick} />
          ) : null}
        </div>
        <NavigationButtons history={history} />
      </div>
      <div className={styles.group}>
        <HardwareWalletStatus />
        <LightDarkToggle className="showOnLargeViewPort" />
        <ApplicationManagementDropDown />
      </div>
    </div>
  );
};

export default TopBar;
