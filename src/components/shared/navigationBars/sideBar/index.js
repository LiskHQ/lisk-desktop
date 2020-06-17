import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import menuLinks from './constants';
import routes from '../../../../constants/routes';
import Icon from '../../../toolbox/icon';
import styles from './sideBar.css';
import Piwik from '../../../../utils/piwik';
import { accountLoggedOut } from '../../../../actions/account';


const MenuItem = ({ data, isUserLogout, pathname }) => (
  <NavLink
    to={data.path}
    className={[
      styles.item,
      isUserLogout && routes[data.id].isPrivate && styles.disabled,
    ].filter(Boolean).join(' ')}
    id={data.id}
    activeClassName={styles.selected}
  >
    <span className={styles.holder}>
      <span className={styles.iconWrapper}>
        <Icon name={`${data.icon}${pathname.startsWith(data.path) ? 'Active' : ''}`} className={styles.icon} />
      </span>
      <span className={styles.label}>{data.label}</span>
    </span>
  </NavLink>
);

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
  const items = menuLinks(t);
  const activeToken = useSelector(state => state.settings.token.active);
  const isUserLogout = useSelector(state => !!state.account.afterLogout);
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
                  !routes[id].forbiddenTokens || !routes[id].forbiddenTokens.includes(activeToken)
                )).map(item => (
                  <MenuItem
                    key={item.id}
                    isUserLogout={isUserLogout}
                    pathname={location.pathname}
                    data={item}
                  />
                ))
              }
              {
                (i === items.length - 1 && !isUserLogout)
                  ? (
                    <SingOut t={t} history={history} />
                  )
                  : null
              }
            </div>
          ))
        }
      </div>
    </nav>
  );
};

export default withTranslation()(SideBar);
