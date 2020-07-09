import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import menuLinks from './constants';
import routes, { modals } from '../../../../constants/routes';
import Icon from '../../../toolbox/icon';
import styles from './sideBar.css';
import Piwik from '../../../../utils/piwik';
import { accountLoggedOut, timerReset } from '../../../../actions/account';
import DialogLink from '../../../toolbox/dialog/link';
import AutoSingOut from './autoSingOut';

const Inner = ({ data, pathname, modal }) => {
  let status = '';
  if (pathname && pathname === data.path) status = 'Active';
  else if (modal && modal === '') status = 'Active';
  return (
    <span className={styles.holder}>
      <span className={styles.iconWrapper}>
        <Icon name={`${data.icon}${status}`} className={styles.icon} />
      </span>
      <span className={styles.label}>{data.label}</span>
    </span>
  );
};

const MenuLink = ({ data, isUserLogout, pathname }) => {
  if (data.modal) {
    const className = `${styles.item} ${isUserLogout && modals[data.id].isPrivate ? styles.disabled : ''}`;
    return (
      <DialogLink component={data.id} className={`${styles.toggle} ${data.id}-toggle ${className}`}>
        <Inner data={data} modal={data.id} />
      </DialogLink>
    );
  }
  const className = `${styles.item} ${isUserLogout && routes[data.id].isPrivate ? styles.disabled : ''}`;
  return (
    <NavLink
      to={data.path}
      className={className}
      id={data.id}
      activeClassName={styles.selected}
      exact={routes[data.id].exact}
    >
      <Inner data={data} pathname={pathname} />
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
      <span className={styles.holder} onClick={signOut}>
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
  const expireTime = useSelector(state => state.account.expireTime);
  const token = useSelector(state => state.settings.token.active);
  const isLoggedOut = useSelector(state => !state.account.info || !state.account.info[token]);
  const autoSigOut = useSelector(state => state.settings.autoLog);
  const sideBarExpanded = useSelector(state => state.settings.sideBarExpanded);

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
              {
                autoSigOut ? (
                  <AutoSingOut
                    expireTime={expireTime}
                    onCountdownComplete={() => dispatch(accountLoggedOut())}
                    history={history}
                    resetTimer={() => dispatch(timerReset(new Date()))}
                    t={t}
                  />
                ) : null
              }
            </div>
          ))
        }
      </div>
    </nav>
  );
};

export default withTranslation()(SideBar);
