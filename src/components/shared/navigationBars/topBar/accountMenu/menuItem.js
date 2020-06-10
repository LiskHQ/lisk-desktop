import React from 'react';
import { Link } from 'react-router-dom';
import styles from './userAccount.css';
import Icon from '../../../../toolbox/icon';

const MenuItem = ({
  name, title, onClick, href, to, className,
}) => {
  let Element = Link;
  if (!to && href) {
    Element = ({ children, ...rest }) => (
      <a
        {...rest}
        rel="noopener noreferrer"
        target="_blank"
      >
        { children }
      </a>
    );
  } else if (!to && !href) {
    Element = ({ children, ...rest }) => <span {...rest}>{children}</span>;
  }

  return (
    <Element
      id={name}
      to={to}
      href={href}
      className={`${styles.dropdownOption} ${className}`}
      onClick={onClick}
    >
      <Icon name={name} className={styles.defaultIcon} />
      <Icon name={`${name}Active`} className={styles.activeIcon} />
      <span>{title}</span>
    </Element>
  );
};

export default MenuItem;
