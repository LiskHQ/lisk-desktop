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

const Header = props => (
  <header className={`${grid.row} ${grid['between-xs']} ${styles.wrapper}`}>
    <PrivateWrapper>
      <div className={grid.row}>
        <Button className={`${styles.button} logout-button`} raised onClick={props.logOut}>{props.t('LOGOUT')}</Button>
        <div className={styles.accountWrapper}>
          <div className={styles.accountInformation} align="right">
            <div className={styles.accountInformationBalance}>
              <LiskAmount val={props.account.balance}/> LSK
            </div>
            <div className={`${styles.accountInformationAddress} account-information-address`}>{props.account.address}</div>
            <div className={styles.accountInformationTimer}>
              <img src={lock} /> Address timeout in 09:32</div>
          </div>
          <div className={styles.accountAvatar}></div>
          <div className={styles.accountMenuIcon}>
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
      </div>

    </PrivateWrapper>
  </header>
);

export default Header;
