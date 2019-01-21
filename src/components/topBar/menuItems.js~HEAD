import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './menuItems.css';

const MenuItems = props => (
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
          <img src={ props.location.pathname === item.path ? item.iconActive : item.icon } />
          <span>{props.t(item.label)}</span>
        </NavLink>)
    }
  </div>
);

export default MenuItems;
