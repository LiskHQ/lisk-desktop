import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './menuItems.css';

const MenuItems = (props) => {
  function isActive(menuItem) {
    const { location } = props;
    return location.pathname.includes(menuItem.path);
  }

  return (
    <div className={`${styles.wrapper} menu-items`}>
      {
        props.items && props.items.map(item =>
          <NavLink
            key={item.id}
            to={item.path}
            className={`${styles.item} ${(props.isUserLogout && item.id !== 'dashboard') ? styles.notActive : ''}`}
            id={item.id}
            activeClassName={styles.selected}
          >
            <img src={ isActive(item) ? item.iconActive : item.icon } />
            <span>{item.label}</span>
          </NavLink>)
      }
    </div>
  );
};

export default MenuItems;
