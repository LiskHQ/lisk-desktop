/* istanbul ignore file */
import React from 'react';
import Icon from 'src/theme/Icon';
import styles from './Overview.css';

const NumericInfo = ({
  icon,
  value,
  title,
}) => (
  <section className={styles.numericInfo}>
    <Icon name={icon} />
    <main className={`${styles.main} ${icon || ''}`}>
      <h6>{title}</h6>
      <p className={`timeValue-${icon}`}>{value}</p>
    </main>
  </section>
);

export default NumericInfo;
