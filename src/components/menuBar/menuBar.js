import React from 'react';
import { FontIcon } from '../fontIcon';
import styles from './menuBar.css';

const MenuBar = (props) => {
  const { t, menuStatus, menuToggle } = props;
  const menuClass = menuStatus ? styles.openMenu : '';
  return (
    <section className={`${styles.menuBar} ${menuClass} menuBar`}>
      {!menuStatus ?
        <span className={`${styles.menuButton} menu-button expand`}
          onClick={() => menuToggle()}>
          {t('Menu')}<FontIcon className={styles.icon} value='menu' />
        </span>
        : <span className={`${styles.menuButton} menu-button close`}
          onClick={() => menuToggle()}>
          {t('Close')} <FontIcon className={styles.icon} value='close' />
        </span>
      }
    </section>
  );
};

export default MenuBar;

