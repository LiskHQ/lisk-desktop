import React from 'react';
import { Link } from 'react-router-dom';
import routes from 'src/routes/routes';
import { isEmpty } from 'src/utils/helpers';
import Icon from 'src/theme/Icon';
import DialogLink from 'src/theme/dialog/link';
import { PrimaryButton } from 'src/theme/buttons';
import Tooltip from 'src/theme/Tooltip';
import VoteQueueToggle from 'src/modules/common/components/bars/topBar/voteQueueToggle';
import DiscreteModeToggle from 'src/modules/settings/components/discreteModeToggle';
import LightDarkToggle from 'src/modules/settings/components/lightDarkModeToggle';
import SideBarToggle from 'src/modules/settings/components/sideBarToggle';
import Search from '@search/components/Search';
import ApplicationManagementDropDown from '@blockchainApplication/manage/components/ApplicationManagementDropDown';
import styles from './topBar.css';
import Network from './networkName';
import NavigationButtons from './navigationButtons';
// import SignOut from './signOut';

const TopBar = ({
  t,
  account,
  history,
  network,
  token,
  noOfVotes,
  location,
}) => {
  const isUserLogout = isEmpty(account) || account.afterLogout;
  const disabled = location.pathname === routes.reclaim.path;

  return (
    <div className={`${styles.wrapper} top-bar`}>
      <div className={styles.group}>
        <Icon name="liskLogo" className={`${styles.logo} topbar-logo`} />
        <NavigationButtons history={history} account={account} />
        <SideBarToggle />
        <Tooltip
          className={styles.tooltipWrapper}
          size="maxContent"
          position="bottom"
          content={(
            <DialogLink
              component="bookmarks"
              className={`${styles.toggle} bookmark-list-toggle ${
                disabled && `${styles.disabled} disabled`
              }`}
            >
              <Icon name="bookmark" className={styles.bookmarksIcon} />
            </DialogLink>
          )}
        >
          <p>{t('Bookmarks')}</p>
        </Tooltip>
        <VoteQueueToggle
          t={t}
          noOfVotes={noOfVotes}
          isUserLogout={isUserLogout}
          disabled={disabled}
        />
        <Search t={t} history={history} disabled={disabled} />
      </div>
      <div className={styles.group}>
        <ApplicationManagementDropDown />
        <LightDarkToggle />
        {!isUserLogout && <DiscreteModeToggle />}
        {location.pathname !== routes.register.path && (
          <Network token={token.active} network={network} t={t} />
        )}
      </div>
    </div>
  );
};

export default TopBar;
