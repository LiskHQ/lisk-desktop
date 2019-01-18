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
          className={styles.item}
          activeClassName={styles.selected}
        >
          <img src={item.icon} />
          <span>{item.label}</span>
        </NavLink>)
    }
  </div>
);

export default MenuItems;
