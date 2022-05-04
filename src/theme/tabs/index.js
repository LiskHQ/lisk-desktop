import React from 'react';
import styles from './tabs.css';

const Tabs = ({
  tabs, active, onClick, className, isActive,
}) => (
  <ul className={styles.wrapper}>
    {tabs.map((filter, i) => (
      <li
        key={i}
        className={[
          'tab',
          className,
          filter.className,
          ((active === filter.value) || isActive(filter.value)) ? `${styles.active} active` : '',
        ].join(' ')}
        onClick={() => onClick(filter)}
      >
        {filter.name}
      </li>
    ))}
  </ul>
);

const emptyFn = () => {};

Tabs.defaultProps = {
  tabs: [],
  onClick: emptyFn,
  isActive: emptyFn,
  className: '',
};

export default Tabs;
