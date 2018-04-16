import React, { Fragment } from 'react';
import { FontIcon } from '../fontIcon';
import styles from './menuBar.css';

const MenuBar = (props) => {
  const { t, menuStatus, settingStatus, menuToggle, settingToggle } = props;
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
      {menuStatus ?
        <Fragment>
          {!settingStatus ?
            <span className={`${styles.menuButton} ${styles.setting} setting expand`}
              onClick={() => settingToggle()}>
              {t('Settings')}
            </span> :
            <span className={`${styles.menuButton} ${styles.setting} setting close`}
              onClick={() => settingToggle()}>
              <FontIcon className={`${styles.icon} ${styles.goBack}`} value='arrow-left' /> {t('Main menu')}
            </span>
          }
        </Fragment>
        : ''
      }
    </section>
  );
};

export default MenuBar;

