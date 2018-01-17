import React, { Fragment } from 'react';

import { FontIcon as MaterialIcon } from 'react-toolbox/lib/font_icon';
import { FontIcon } from '../fontIcon';
import styles from './menuBar.css';

const MenuBar = (props) => {
  const { t, menuStatus, settingStatus, menuToggle, settingToggle } = props;
  const menuClass = menuStatus ? styles.openMenu : '';
  const openSetting = (menuStatus && settingStatus) ? styles.openSetting : '';
  return (
    <section className={`${styles.menuBar} ${menuClass} ${openSetting}`}>
      {!menuStatus ?
        <span className={styles.menuButton}
          onClick={() => menuToggle()}>
          {t('Menu')}<MaterialIcon value='menu' />
        </span>
        : <span className={styles.menuButton}
          onClick={() => menuToggle()}>
          {t('Close')} <FontIcon value='close' />
        </span>
      }
      {menuStatus ?
        <Fragment>
          {!settingStatus ?
            <span className={styles.menuButton}
              onClick={() => settingToggle()}>
              {t('Setting')}
            </span> :
            <span className={styles.menuButton}
              onClick={() => settingToggle()}>
              <FontIcon value='arrow-left' /> {t('Main menu')}
            </span>
          }
        </Fragment>
        : ''
      }
    </section>
  );
};

export default MenuBar;

