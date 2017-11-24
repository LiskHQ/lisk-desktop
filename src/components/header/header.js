import { IconMenu, MenuItem, MenuDivider } from 'react-toolbox/lib/menu';
import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { Button } from '../toolbox/buttons/button';

import LiskAmount from '../liskAmount';
import PrivateWrapper from '../privateWrapper';
import offlineStyle from '../offlineWrapper/offlineWrapper.css';
import styles from './header.css';
import RelativeLink from '../relativeLink';
import lock from './../../assets/images/lock-open.svg';

const Header = props => (<header className={`${grid.row} ${grid['between-xs']} ${styles.wrapper}`}>
  <Button className={`${styles.button} logout-button`} raised onClick={props.logOut}>{props.t('LOGOUT')}</Button>
  <RelativeLink raised className={`${styles.button} ${styles.secondaryBlue} receive-button`}
    to='receive'>{props.t('Receive LSK')}</RelativeLink>
  <RelativeLink raised disableWhenOffline className={`${styles.button} ${styles.primary} send-button`}
    to='send'>{props.t('send')}</RelativeLink>
  <PrivateWrapper>
    <div className={styles.account__wrapper}>
      <div className={styles.account__information} align="right">
        <div className={styles.account__information__balance}>
          <LiskAmount val={props.account.balance}/> LSK
        </div>
        <div className={styles.account__information__address}>{props.account.address}</div>
        <div className={styles.account__information__timer}>
          <img src={lock} /> Address timeout in 09:32</div>
      </div>
      <div className={styles.account__avatar}></div>
      <div className={styles.account__menuIcon}>
        <IconMenu
          className={`${styles.iconButton} main-menu-icon-button ${offlineStyle.disableWhenOffline}`}
          icon="favorite"
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

      </div>
    </div>
  </PrivateWrapper>
</header>
);

export default Header;
