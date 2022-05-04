import React from 'react';
import { Link } from 'react-router-dom';
import routes from '@screens/router/routes';
import { isEmpty } from 'src/utils/helpers';
import Icon from 'src/theme/Icon';
import DialogLink from 'src/theme/dialog/link';
import { PrimaryButton } from 'src/theme/buttons';
import Tooltip from 'src/theme/Tooltip';
import VoteQueueToggle from '@settings/setters/toggles/voteQueueToggle';
import DiscreteModeToggle from 'src/modules/settings/components/discreteModeToggle';
import LightDarkToggle from 'src/modules/settings/components/lightDarkModeToggle';
import SideBarToggle from 'src/modules/settings/components/sideBarToggle';
import Search from '@search/components/Search';
import styles from './topBar.css';
import Network from './networkName';
import NavigationButtons from './navigationButtons';
import SignOut from './signOut';

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
        <LightDarkToggle />
        {!isUserLogout && <DiscreteModeToggle />}
        <Network token={token.active} network={network} t={t} />
        {isUserLogout && history.location.pathname !== routes.login.path ? (
          <Link to={routes.login.path} className={styles.signIn}>
            <PrimaryButton size="s">Sign in</PrimaryButton>
          </Link>
        ) : null}
        {!isUserLogout && <SignOut t={t} history={history} />}
      </div>
    </div>
  );
};

export default TopBar;
