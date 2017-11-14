import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import Button from './../toolbox/button';
import { IconMenu, MenuItem, MenuDivider } from './../toolbox/menu';

import PrivateWrapper from '../privateWrapper';
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
            <MenuItem theme={styles}>
              <RelativeLink className={`register-as-delegate ${styles.menuLink}`}
                to='register-delegate'>{props.t('Register as delegate')}</RelativeLink>
            </MenuItem>
        }
        {
          !props.account.secondSignature &&
            <MenuItem theme={styles}>
              <RelativeLink className={`register-second-passphrase ${styles.menuLink}`}
                to='register-second-passphrase'>{props.t('Register second passphrase')}</RelativeLink>
            </MenuItem>
        }
        <MenuItem theme={styles}>
          <RelativeLink className={`sign-message ${styles.menuLink}`} to='sign-message'>{props.t('Sign message')}</RelativeLink>
        </MenuItem>
        <MenuItem theme={styles}>
          <RelativeLink className={`verify-message ${styles.menuLink}`}
            to='verify-message'>{props.t('Verify message')}</RelativeLink>
        </MenuItem>
        <MenuItem theme={styles}>
          <RelativeLink className={`encrypt-message ${styles.menuLink}`}
            to='encrypt-message'>{props.t('Encrypt message')}</RelativeLink>
        </MenuItem>
        <MenuItem theme={styles}>
          <RelativeLink className={`decrypt-message ${styles.menuLink}`}
            to='decrypt-message'>{props.t('Decrypt message')}</RelativeLink>
        </MenuItem>
        <MenuDivider />
        <MenuItem theme={styles}>
          <RelativeLink className={`${styles.menuLink} saved-accounts`}
            to='saved-accounts'>{props.t('Saved accounts')}</RelativeLink>
        </MenuItem>
        <MenuItem theme={styles}>
          <RelativeLink className={`settings ${styles.menuLink}`} to='settings'>{props.t('Settings')}</RelativeLink>
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
