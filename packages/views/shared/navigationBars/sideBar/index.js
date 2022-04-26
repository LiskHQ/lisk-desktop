import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import account from '@wallet/configuration/account';
import routes, { modals } from '@screens/router/routes';
import { accountLoggedOut } from '@common/store/actions';
import Icon from '@basics/icon';
import DialogLink from '@basics/dialog/link';
import styles from './sideBar.css';
import AutoSignOut from './autoSignOut';
import WarningAutoSignOut from './autoSignOut/warning';
import menuLinks from './menuLinks';

const Inner = ({
  data, pathname, sideBarExpanded,
}) => {
  let status = '';
  if (pathname && pathname === data.path) {
    status = 'Active';
  }
  return (
    <span className={styles.holder}>
      <span className={styles.iconWrapper}>
        <Icon name={`${data.icon}${status}`} className={styles.icon} />
      </span>
      {sideBarExpanded && <span className={styles.label}>{data.label}</span>}
    </span>
  );
};

const MenuLink = ({
  data, isUserLogout, pathname, sideBarExpanded,
}) => {
  if (data.modal) {
    const className = `${styles.item} ${(isUserLogout && modals[data.id].isPrivate) || pathname === routes.reclaim.path ? `${styles.disabled} disabled` : ''}`;
    return (
      <DialogLink component={data.id} className={`${styles.toggle} ${data.id}-toggle ${className}`}>
        <Inner data={data} modal={data.id} sideBarExpanded={sideBarExpanded} />
      </DialogLink>
    );
  }

  const className = `${styles.item} ${(isUserLogout && routes[data.id].isPrivate) || pathname === routes.reclaim.path ? `${styles.disabled} disabled` : ''}`;
  return (
    <NavLink
      to={data.path}
      className={className}
      id={data.id}
      activeClassName={styles.selected}
      exact={routes[data.id].exact}
    >
      <Inner data={data} pathname={pathname} sideBarExpanded={sideBarExpanded} />
    </NavLink>
  );
};

const getWarningTime = (expireTime) => {
  if (!expireTime) {
    return null;
  }

  const diff = account.lockDuration - account.warnLockDuration;
  const expireTimeInMilliseconds = new Date(expireTime).getTime();

  return new Date(expireTimeInMilliseconds - diff);
};

const AutoSignOutWrapper = () => {
  const dispatch = useDispatch();
  const expireTime = useSelector(state => state.wallet.expireTime);
  const warningTime = getWarningTime(expireTime);
  const autoSignOut = useSelector(state => state.settings.autoLog);
  const renderAutoSignOut = autoSignOut && expireTime;

  if (!renderAutoSignOut) {
    return null;
  }

  return (
    <div className={styles.signOutContainer}>
      <AutoSignOut
        expireTime={expireTime}
        onCountdownComplete={() => dispatch(accountLoggedOut())}
      />
      <WarningAutoSignOut
        warningTime={warningTime}
        expireTime={expireTime}
      />
    </div>
  );
};

const SideBar = ({
  t, location,
}) => {
  const items = menuLinks(t);
  const token = useSelector(state => state.settings.token.active);
  const isLoggedOut = useSelector(state => !state.wallet.info || !state.wallet.info[token]);
  const sideBarExpanded = useSelector(state => state.settings.sideBarExpanded);

  return (
    <nav className={`${styles.wrapper} ${sideBarExpanded ? 'expanded' : ''}`}>
      <AutoSignOutWrapper />
      <div className={`${styles.container} menu-items`}>
        {
          items.map((group, i) => (
            <div
              className={styles.menuGroup}
              key={`group-${i}`}
            >
              {
                group.filter(({ id }) => (
                  (routes[id] && !routes[id].forbiddenTokens.includes(token))
                  || (modals[id] && !modals[id].forbiddenTokens.includes(token))
                )).map(item => (
                  <MenuLink
                    key={item.id}
                    isUserLogout={isLoggedOut}
                    pathname={location.pathname}
                    data={item}
                    sideBarExpanded={sideBarExpanded}
                  />
                ))
              }
            </div>
          ))
        }
      </div>
    </nav>
  );
};

export default withTranslation()(SideBar);
