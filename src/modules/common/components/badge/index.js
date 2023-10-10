import React from 'react';
import classNames from 'classnames';
import styles from './styles.css';

const Badge = ({ className }) => (
  <span className={classNames(styles.badge, className)} data-testid="notification" />
);

export default Badge;
