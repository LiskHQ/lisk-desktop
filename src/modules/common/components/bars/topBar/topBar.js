import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import routes from 'src/routes/routes';
import Icon from 'src/theme/Icon';
import AccountManagementDropdown from '@account/components/AccountManagementDropdown';
import DialogLink from 'src/theme/dialog/link';
import Tooltip from 'src/theme/Tooltip';
import StakeQueueToggle from '@common/components/bars/topBar/stakeQueueToggle';
import DiscreteModeToggle from 'src/modules/settings/components/discreteModeToggle';
import LightDarkToggle from 'src/modules/settings/components/lightDarkModeToggle';
import ApplicationManagementDropDown from '@blockchainApplication/manage/components/NetworkApplicationDropDownButton';
import SearchBar from 'src/modules/search/manager/searchBarManager';
import { useCurrentAccount } from '@account/hooks';
import { HardwareWalletStatus } from '@hardwareWallet/components/HardwareWalletStatus';
import { isEmpty } from 'src/utils/helpers';
import NavigationButtons from '@common/components/bars/topBar/navigationButtons';
import styles from './topBar.css';

const TopBar = ({ stakeCount, location, history }) => {
  const disabled = [routes.reclaim.path].includes(location.pathname);
  const [currentAccount] = useCurrentAccount();
  const [menuOpen, setMenuOpen] = useState(false);
  const { t } = useTranslation();

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
        <SearchBar className={styles.searchBarProp} />
      </div>
      <div className={styles.group}>
        <HardwareWalletStatus />
        <Tooltip
          className={styles.tooltipWrapper}
          size="maxContent"
          position="bottom"
          content={
            <DialogLink
              component="bookmarks"
              className={`${styles.toggle} bookmark-list-toggle ${
                disabled && `${styles.disabled} disabled`
              }`}
            >
              <Icon name="bookmark" className={styles.bookmarksIcon} />
            </DialogLink>
          }
        >
          <p>{t('Bookmarks')}</p>
        </Tooltip>
        <LightDarkToggle className="showOnLargeViewPort" />
        <StakeQueueToggle t={t} stakeCount={stakeCount} disabled={disabled} />
        <DiscreteModeToggle className="showOnLargeViewPort" />
        <ApplicationManagementDropDown />
      </div>
    </div>
  );
};

export default TopBar;
