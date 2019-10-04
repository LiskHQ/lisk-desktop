import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import styles from './menuItems.css';
import Icon from '../../../toolbox/icon';

const MenuItems = ({
  location: { pathname }, className, items, isUserLogout, token,
}) => (
  <div className={`${styles.wrapper} ${className} menu-items`}>
    {
      items.filter(({ forbiddenTokens }) => (
        !forbiddenTokens || forbiddenTokens.indexOf(token) === -1
      )).map(item => (
        <NavLink
          key={item.id}
          to={item.path}
          className={`${styles.item} ${(isUserLogout && item.id === 'transactions') ? styles.notActive : ''}`}
          id={item.id}
          activeClassName={styles.selected}
        >
          <Icon name={`${item.icon}${pathname.includes(item.path) ? 'Active' : ''}`} />
          <span className={styles.label}>{item.label}</span>
        </NavLink>
      ))
    }
  </div>
);

MenuItems.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }).isRequired,
  items: PropTypes.array.isRequired,
  className: PropTypes.string,
  isUserLogout: PropTypes.bool.isRequired,
};

MenuItems.defaultProps = {
  className: '',
};

export default MenuItems;
