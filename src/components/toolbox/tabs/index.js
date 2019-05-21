import React from 'react';
import styles from './tabs.css';

const Tabs = ({
  tabs = [], active, onClick = () => {}, className,
}) => (
  <ul className={styles.wrapper}>
    {tabs.map((filter, i) => (
      <li key={i}
        className={`${className} ${filter.className} ${(active === filter.value) ? styles.active : ''}`}
        onClick={() => onClick(filter)}>
        {filter.name}
      </li>
    ))}
  </ul>
);

export default Tabs;
