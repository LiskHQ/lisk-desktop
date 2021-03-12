import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import menuLinks from 'constants';
import routes, { modals } from 'constants';
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

const MenuLink = ({
  data, isUserLogout, pathname, sideBarExpanded,
}) => {
  if (data.modal) {
    const className = `${styles.item} ${isUserLogout && modals[data.id].isPrivate ? `${styles.disabled} disabled` : ''}`;
    return (
      <DialogLink component={data.id} className={`${styles.toggle} ${data.id}-toggle ${className}`}>
        <Inner data={data} modal={data.id} sideBarExpanded={sideBarExpanded} />
      </DialogLink>
    );
  }

  const className = `${styles.item} ${isUserLogout && routes[data.id].isPrivate ? `${styles.disabled} disabled` : ''}`;
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
