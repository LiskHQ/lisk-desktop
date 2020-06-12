import React from 'react';
import { useSelector } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import menuLinks from './constants';
import routes from '../../../../constants/routes';
import Icon from '../../../toolbox/icon';
import styles from './sideBar.css';


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

const SideBar = ({
  t, location,
}) => {
  const items = menuLinks(t);
  const activeToken = useSelector(state => state.settings.token.active);
  const isUserLogout = useSelector(state => !!state.account.afterLogout);
  const sideBarExpanded = useSelector(state => state.settings.sideBarExpanded);

  return (
    <nav className={styles.wrapper}>
      <div className={`${styles.container} menu-items`}>
        {
          items.map((group, i) => (
            <div
              className={`${styles.menuGroup} ${sideBarExpanded ? styles.expanded : ''}`}
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
            </div>
          ))
        }
      </div>
    </nav>
  );
};

export default withTranslation()(SideBar);
