import React from 'react';

import { FontIcon } from 'react-toolbox/lib/font_icon';

import styles from './menuBar.css';

const MenuBar = ({ t }) => (
  <section className={styles.menuBar}>
    <span className={`${styles.menuItem} ${styles.menuButton}`}>
      {t('Menu')} <FontIcon value='menu' />
    </span>
  </section>
);

export default MenuBar;

