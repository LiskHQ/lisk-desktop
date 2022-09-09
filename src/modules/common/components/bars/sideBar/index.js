import React from 'react';
import { useSelector } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import routes, { modals } from 'src/routes/routes';
import Icon from 'src/theme/Icon';
import { selectActiveToken } from 'src/redux/selectors';
import DialogLink from 'src/theme/dialog/link';
import styles from './sideBar.css';
import menuLinks from './menuLinks';

const Inner = ({ data, pathname, sideBarExpanded }) => {
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

const MenuLink = ({ data, isUserLogout, pathname, sideBarExpanded }) => {
  if (data.modal) {
    const className = `${styles.item} ${
      (isUserLogout && modals[data.id].isPrivate) || pathname === routes.reclaim.path
        ? `${styles.disabled} disabled`
        : ''
    }`;
    return (
      <DialogLink component={data.id} className={`${styles.toggle} ${data.id}-toggle ${className}`}>
        <Inner data={data} modal={data.id} sideBarExpanded={sideBarExpanded} />
      </DialogLink>
    );
  }

  const className = `${styles.item} ${
    (isUserLogout && routes[data.id].isPrivate) || pathname === routes.reclaim.path
      ? `${styles.disabled} disabled`
      : ''
  }`;
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

const SideBar = ({ t, location }) => {
  const items = menuLinks(t);
  const token = useSelector(selectActiveToken);
  const isLoggedOut = useSelector((state) => !state.wallet.info || !state.wallet.info[token]);
  const sideBarExpanded = useSelector((state) => state.settings.sideBarExpanded);

  return (
    <nav className={`${styles.wrapper} ${sideBarExpanded ? 'expanded' : ''}`}>
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
                  isUserLogout={isLoggedOut}
                  pathname={location.pathname}
                  data={item}
                  sideBarExpanded={sideBarExpanded}
                />
              ))}
          </div>
        ))}
      </div>
    </nav>
  );
};

export default withTranslation()(SideBar);
