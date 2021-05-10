import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import menuLinks from './constants';
import routes, { modals } from '../../../../constants/routes';
import Icon from '../../../toolbox/icon';
import styles from './sideBar.css';
import Piwik from '../../../../utils/piwik';
import { accountLoggedOut } from '../../../../actions/account';
import DialogLink from '../../../toolbox/dialog/link';
import AutoSignOut from './autoSignOut';

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

const isDisabled = (isOnline, dic, id, isUserLogout, pathname) => (
  (!isOnline && id !== 'settings')
  || (isUserLogout && dic[id].isPrivate)
  || pathname === routes.initialization.path
);

const MenuLink = ({
  data, isUserLogout, pathname, sideBarExpanded, isOnline,
}) => {
  if (data.modal) {
    const disabled = isDisabled(isOnline, modals, data.id, isUserLogout, pathname)
      ? `${styles.disabled} disabled` : '';
    return (
      <DialogLink component={data.id} className={`${styles.toggle} ${data.id}-toggle ${styles.item} ${disabled}`}>
        <Inner data={data} modal={data.id} sideBarExpanded={sideBarExpanded} />
      </DialogLink>
    );
  }

  const disabled = isDisabled(isOnline, routes, data.id, isUserLogout, pathname)
    ? `${styles.disabled} disabled` : '';
  return (
    <NavLink
      to={data.path}
      className={`${styles.item} ${disabled}`}
      id={data.id}
      activeClassName={styles.selected}
      exact={routes[data.id].exact}
    >
      <Inner data={data} pathname={pathname} sideBarExpanded={sideBarExpanded} />
    </NavLink>
  );
};

const SingOut = ({ t, history }) => {
  const dispatch = useDispatch();

  const signOut = () => {
    Piwik.trackingEvent('Header', 'button', 'Open logout dialog');
    dispatch(accountLoggedOut());
    history.replace(`${routes.login.path}`);
  };

  return (
    <div className={styles.item}>
      <span className={`${styles.holder} logoutBtn`} onClick={signOut}>
        <span className={styles.iconWrapper}>
          <Icon name="signOut" className={styles.icon} />
        </span>
        <span className={styles.label}>{t('Sign out')}</span>
      </span>
    </div>
  );
};

const SideBar = ({
  t, location, history,
}) => {
  const dispatch = useDispatch();
  const items = menuLinks(t);
  const token = useSelector(state => state.settings.token.active);
  const network = useSelector(state => state.network);
  const isLoggedOut = useSelector(state => !state.account.info || !state.account.info[token]);
  const expireTime = useSelector(state => state.account.expireTime);
  const autoSignOut = useSelector(state => state.settings.autoLog);
  const sideBarExpanded = useSelector(state => state.settings.sideBarExpanded);
  const renderAutoSignOut = autoSignOut && expireTime;

  return (
    <nav className={`${styles.wrapper} ${sideBarExpanded ? 'expanded' : ''}`}>
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
                    isOnline={network.status.online}
                    key={item.id}
                    isUserLogout={isLoggedOut}
                    pathname={location.pathname}
                    data={item}
                    sideBarExpanded={sideBarExpanded}
                  />
                ))
              }
              {
                (i === items.length - 1 && !isLoggedOut)
                  ? (
                    <SingOut t={t} history={history} />
                  )
                  : null
              }

            </div>
          ))
        }
      </div>
      {
        renderAutoSignOut && (
          <AutoSignOut
            expireTime={expireTime}
            onCountdownComplete={() => dispatch(accountLoggedOut())}
          />
        )
      }
    </nav>
  );
};

export default withTranslation()(SideBar);
