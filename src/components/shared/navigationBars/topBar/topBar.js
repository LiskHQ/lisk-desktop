import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { routes } from '@constants';
import { isEmpty } from '@utils/helpers';
import Icon from '@toolbox/icon';
import DialogLink from '@toolbox/dialog/link';
import { PrimaryButton } from '@toolbox/buttons';
import Tooltip from '@toolbox/tooltip/tooltip';
import Piwik from '@utils/piwik';
import { accountLoggedOut } from '@actions';
import styles from './topBar.css';
import Network from './networkName';
import NavigationButtons from './navigationButtons';
import Search from './search';
import Toggle from './toggle';
import TokenSelector from './tokenSelector';
import VoteQueueToggle from './voteQueueToggle';

const SingOut = ({ t, history }) => {
  const dispatch = useDispatch();

  const signOut = () => {
    Piwik.trackingEvent('Header', 'button', 'Open logout dialog');
    dispatch(accountLoggedOut());
    history.replace(`${routes.login.path}`);
  };

  return (
    <div className={styles.logoutBtn}>
      <span className={`${styles.iconWrapper} logoutBtn`} onClick={signOut}>
        <Icon name="signOut" className={styles.icon} />
      </span>
    </div>
  );
};

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
        <Icon
          name="liskLogo"
          className={`${styles.logo} topbar-logo`}
        />
        <NavigationButtons
          history={history}
          account={account}
        />
        <Toggle
          setting="sideBarExpanded"
          icons={['toggleSidebarActive', 'toggleSidebar']}
          tips={[t('Collapse sidebar'), t('Expand sidebar')]}
        />
        <Tooltip
          className={styles.tooltipWrapper}
          size="maxContent"
          position="bottom"
          content={(
            <DialogLink
              component="bookmarks"
              className={`${styles.toggle} bookmark-list-toggle ${disabled && `${styles.disabled} disabled`}`}
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
        { !isUserLogout ? <TokenSelector token="LSK" history={history} t={t} disabled={disabled} /> : null }
        { !isUserLogout && token.list.BTC ? <TokenSelector token="BTC" history={history} t={t} disabled={disabled} /> : null }
        <Toggle
          setting="darkMode"
          icons={['lightMode', 'darkMode']}
          tips={[t('Disable dark mode'), t('Enable dark mode')]}
        />
        {
          !isUserLogout ? (
            <Toggle
              setting="discreetMode"
              icons={['discreetModeActive', 'discreetMode']}
              tips={[t('Disable discreet mode'), t('Enable discreet mode')]}
            />
          ) : null
        }
        <Network
          token={token.active}
          network={network}
          t={t}
        />
        {
          isUserLogout && history.location.pathname !== routes.login.path ? (
            <Link to={routes.login.path} className={styles.signIn}>
              <PrimaryButton size="s">Sign in</PrimaryButton>
            </Link>
          ) : null
        }
        {!isUserLogout && <SingOut t={t} history={history} />}
      </div>
    </div>
  );
};

export default TopBar;
