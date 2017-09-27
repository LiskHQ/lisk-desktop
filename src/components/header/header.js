import { Button } from 'react-toolbox/lib/button';
import { IconMenu, MenuItem, MenuDivider } from 'react-toolbox/lib/menu';
import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';

import PrivateWrapper from '../privateWrapper';
import SaveAccountButton from '../saveAccountButton';
import logo from '../../assets/images/LISK-nano.png';
import offlineStyle from '../offlineWrapper/offlineWrapper.css';
import styles from './header.css';
import RelativeLink from '../relativeLink';

const Header = props => (
  <header className={`${grid.row} ${grid['between-xs']} ${styles.wrapper}`} >
    <div className={styles.logoWrapper}>
      <img className={styles.logo} src={logo} alt="logo" />
    </div>
    <PrivateWrapper>
      <IconMenu
        className={`${styles.iconButton} main-menu-icon-button ${offlineStyle.disableWhenOffline}`}
        icon="more_vert"
        position="topRight"
        menuRipple
        theme={styles}
      >
        {
          !props.account.isDelegate &&
            <MenuItem>
              <RelativeLink className={`register-as-delegate ${styles.menuItem}`}
                to='register-delegate'>Register as delegate</RelativeLink>
            </MenuItem>
        }
        {
          !props.account.secondSignature &&
            <MenuItem>
              <RelativeLink className={`register-second-passphrase ${styles.menuItem}`}
                to='register-second-passphrase'>Register second passphrase</RelativeLink>
            </MenuItem>
        }
        <MenuItem>
          <RelativeLink className={`sign-message ${styles.menuItem}`} to='sign-message'>Sign message</RelativeLink>
        </MenuItem>
        <MenuItem>
          <RelativeLink className={`verify-message ${styles.menuItem}`}
            to='verify-message'>Verify message</RelativeLink>
        </MenuItem>
        <MenuDivider />
        <SaveAccountButton />
        <MenuItem>
          <RelativeLink className={`settings ${styles.menuItem}`} to='settings'>{props.t('Settings')}</RelativeLink>
        </MenuItem>
      </IconMenu>

      <Button className={`${styles.button} logout-button`} raised onClick={props.logOut}>{props.t('logout')}</Button>
      <RelativeLink neutral raised className={`${styles.button} receive-button`}
        to='receive'>{props.t('Receive LSK')}</RelativeLink>
      <RelativeLink primary raised disableWhenOffline className={`${styles.button} send-button`}
        to='send'>{props.t('send')}</RelativeLink>
    </PrivateWrapper>
  </header>
);

export default Header;
