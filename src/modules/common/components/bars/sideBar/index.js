import React, { useContext, useState } from 'react';
import { useSelector } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import { useCurrentAccount } from '@account/hooks';
import { ApplicationBootstrapContext } from '@setup/react/app/ApplicationBootstrap';
import routes, { modals } from 'src/routes/routes';
import Icon from 'src/theme/Icon';
import { selectActiveToken } from 'src/redux/selectors';
import DialogLink from 'src/theme/dialog/link';
import SidebarToggle from '@settings/components/SidebarToggle';
import styles from './sideBar.css';
import menuLinks from './menuLinks';

const Inner = ({ data, pathname, notification, sideBarExpanded }) => {
  let status = '';
  if (pathname && pathname === data.path) {
    status = 'Active';
  }
  const className = notification ? styles.notification : '';
  return (
    <span className={styles.holder}>
      <span className={styles.iconWrapper}>
        <Icon name={`${data.icon}${status}`} className={styles.icon} />
        {!sideBarExpanded && <span className={`${className} ${styles.collapsedNotification}`} />}
      </span>
      {sideBarExpanded && <span className={styles.label}>{data.label}</span>}
      {sideBarExpanded && <span className={className} />}
    </span>
  );
};

const MenuLink = ({ data, pathname, sideBarExpanded, events, disabled }) => {
  if (data.modal) {
    const className = `${styles.item} ${disabled ? `${styles.disabled} disabled` : ''}`;
    return (
      <DialogLink component={data.id} className={`${styles.toggle} ${data.id}-toggle ${className}`}>
        <Inner data={data} modal={data.id} sideBarExpanded={sideBarExpanded} />
      </DialogLink>
    );
  }

  const className = `${styles.item} ${disabled ? `${styles.disabled} disabled` : ''}`;
  const {
    transactions: { rewards },
  } = events;

  return (
    <NavLink
      to={data.path}
      className={className}
      id={data.id}
      activeClassName={styles.selected}
      exact={routes[data.id].exact}
    >
      <Inner
        data={data}
        pathname={pathname}
        sideBarExpanded={sideBarExpanded}
        notification={
          rewards.length && BigInt(rewards[0]?.reward || 0) > BigInt(0) && data.id === 'validators'
        }
      />
    </NavLink>
  );
};

const SideBar = ({ t, location }) => {
  const [showSidebarToggle, setShowSidebarToggle] = useState(false);
  const items = menuLinks(t);
  const token = useSelector(selectActiveToken);
  const [currentAccount] = useCurrentAccount();
  const isLoggedOut = Object.keys(currentAccount).length === 0;
  const sideBarExpanded = useSelector((state) => state.settings.sideBarExpanded);
  const { hasNetworkError, isLoadingNetwork, appEvents } = useContext(ApplicationBootstrapContext);

  return (
    <nav
      className={`${styles.wrapper} ${sideBarExpanded ? 'expanded' : ''}`}
      onMouseEnter={() => setShowSidebarToggle(true)}
      onMouseLeave={() => setShowSidebarToggle(false)}
    >
      {showSidebarToggle && <SidebarToggle />}
      <div className={`${styles.container} menu-items`}>
        {items.map((group, i) => (
          <div className={styles.menuGroup} key={`group-${i}`}>
            {group
              .filter(
                ({ id }) =>
                  (routes[id] && !routes[id].forbiddenTokens.includes(token)) ||
                  (modals[id] && !modals[id].forbiddenTokens.includes(token))
              )
              .map((item) => (
                <MenuLink
                  key={item.id}
                  pathname={location.pathname}
                  data={item}
                  sideBarExpanded={sideBarExpanded}
                  events={appEvents}
                  disabled={
                    (isLoggedOut && modals[item.id]?.isPrivate) ||
                    location.pathname === routes.reclaim.path ||
                    hasNetworkError ||
                    isLoadingNetwork
                  }
                />
              ))}
          </div>
        ))}
      </div>
    </nav>
  );
};

export default withTranslation()(SideBar);
