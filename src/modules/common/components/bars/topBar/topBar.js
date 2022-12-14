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
import ApplicationManagementDropDown from '@blockchainApplication/manage/components/ApplicationManagementDropDown';
import SearchBar from 'src/modules/search/manager/searchBarManager';
import { useCurrentAccount } from '@account/hooks';
import { isEmpty } from 'src/utils/helpers';
import styles from './topBar.css';
import Network from './networkName';

const TopBar = ({ noOfVotes, location }) => {
  const disabled = location.pathname === routes.reclaim.path;
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
        <SearchBar className={styles.ml24} />
      </div>
      <div className={styles.group}>
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
        <LightDarkToggle />
        <StakeQueueToggle t={t} noOfVotes={noOfVotes} disabled={disabled} />
        <DiscreteModeToggle />
        <ApplicationManagementDropDown />
        {location.pathname !== routes.register.path && <Network />}
      </div>
    </div>
  );
};

export default TopBar;
