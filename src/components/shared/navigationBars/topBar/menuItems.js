import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import React from 'react';
import Icon from '../../../toolbox/icon';
import routes from '../../../../constants/routes';
import styles from './menuItems.css';

const MenuItems = ({
  location: { pathname }, className, items, isUserLogout, token,
}) => (
  <div className={`${styles.wrapper} ${className} menu-items`}>
    {
      items.filter(({ id }) => (
        !routes[id].forbiddenTokens || !routes[id].forbiddenTokens.includes(token.active)
      )).map(item => (
        <NavLink
          key={item.id}
          to={item.path}
          className={[
            styles.item,
            isUserLogout && routes[item.id].isPrivate && styles.disabled,
          ].filter(Boolean).join(' ')}
          id={item.id}
          activeClassName={styles.selected}
        >
          <Icon name={`${item.icon}${pathname.startsWith(item.path) ? 'Active' : ''}`} className={styles.icon} />
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
