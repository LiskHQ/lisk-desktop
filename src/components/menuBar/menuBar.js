import React from 'react';

import { FontIcon } from 'react-toolbox/lib/font_icon';

import styles from './menuBar.css';

const MenuBar = ({ t, history }) => (
  <section className={styles.menuBar}>
    { history.location.pathname.indexOf('transactions') === 6 ?
      <span>
        <span className={styles.menuItem}> {t('Send')} </span>
        <span className={styles.menuItem}> {t('Request')} </span>
      </span> :
      null
    }
    <span className={`${styles.menuItem} ${styles.menuButton}`}>
      {t('Menu')} <FontIcon value='menu' />
    </span>
  </section>
);

export default MenuBar;

