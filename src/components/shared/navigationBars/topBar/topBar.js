import React from 'react';
import { Link } from 'react-router-dom';

import routes from 'constants';
import NavigationButtons from './navigationButtons';
import Network from './networkName';
import styles from './topBar.css';
import Icon from '../../../toolbox/icon';
import DialogLink from '../../../toolbox/dialog/link';
import { PrimaryButton } from '../../../toolbox/buttons';
import { isEmpty } from '../../../../utils/helpers';
import Tooltip from '../../../toolbox/tooltip/tooltip';
import Search from './search';
import Toggle from './toggle';
import TokenSelector from './tokenSelector';
import VoteQueueToggle from './voteQueueToggle';

const TopBar = ({
  t,
  account,
  history,
  network,
  token,
  noOfVotes,
}) => {
  const isUserLogout = isEmpty(account) || account.afterLogout;

  return (
    <div className={`${styles.wrapper} top-bar`}>
      <div className={styles.group}>
        <Icon
          name="liskLogo"
          className={`${styles.logo} topbar-logo`}
        />
        <NavigationButtons
          history={history}
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
            <DialogLink component="bookmarks" className={`${styles.toggle} bookmark-list-toggle`}>
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
        />
        <Search t={t} history={history} />
      </div>
      <div className={styles.group}>
        { !isUserLogout ? <TokenSelector token="LSK" history={history} t={t} /> : null }
        { !isUserLogout && token.list.BTC ? <TokenSelector token="BTC" history={history} t={t} /> : null }
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
      </div>
    </div>
  );
};

export default TopBar;
