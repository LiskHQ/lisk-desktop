import React, { useState } from 'react';
import routes from 'src/routes/routes';
import Icon from 'src/theme/Icon';
import AccountManagementDropdown from '@account/components/AccountManagementDropdown';
import DialogLink from 'src/theme/dialog/link';
import Tooltip from 'src/theme/Tooltip';
import VoteQueueToggle from 'src/modules/common/components/bars/topBar/voteQueueToggle';
import DiscreteModeToggle from 'src/modules/settings/components/discreteModeToggle';
import LightDarkToggle from 'src/modules/settings/components/lightDarkModeToggle';
import SideBarToggle from 'src/modules/settings/components/sideBarToggle';
import Search from '@search/components/Search';
import ApplicationManagementDropDown from '@blockchainApplication/manage/components/ApplicationManagementDropDown';
import { useCurrentAccount } from '@account/hooks';
import { isEmpty } from 'src/utils/helpers';
import styles from './topBar.css';
import Network from './networkName';
import NavigationButtons from './navigationButtons';

const TopBar = ({ t, history, network, token, noOfVotes, location }) => {
  const disabled = location.pathname === routes.reclaim.path;
  const [currentAccount] = useCurrentAccount();
  const [menuOpen, setMenuOpen] = useState(false);

  const onMenuClick = (menuOpenStatus) => {
    setMenuOpen(menuOpenStatus);
  };

  return (
    <div className={`${styles.wrapper} top-bar`}>
      <div className={styles.group}>
        <div className={`${styles.section} ${menuOpen ? styles.menuOpen : ''}`}>
          <Icon name="liskLogo" className={`${styles.logo} topbar-logo`} />
          {!isEmpty(currentAccount) ? (
            <AccountManagementDropdown currentAccount={currentAccount} onMenuClick={onMenuClick} />
          ) : null}
        </div>
        <NavigationButtons history={history} />
        <SideBarToggle />
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
        <VoteQueueToggle t={t} noOfVotes={noOfVotes} disabled={disabled} />
        <Search t={t} history={history} disabled={disabled} />
      </div>
      <div className={styles.group}>
        <ApplicationManagementDropDown />
        <LightDarkToggle />
        <DiscreteModeToggle />
        {location.pathname !== routes.register.path && (
          <Network token={token.active} network={network} t={t} />
        )}
      </div>
    </div>
  );
};

export default TopBar;
