import { IconMenu, MenuItem, MenuDivider } from 'react-toolbox/lib/menu';
import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import Countdown from 'react-countdown-now';
import { FontIcon } from '../fontIcon';
import CountDownTemplate from './countDownTemplate';
import LiskAmount from '../liskAmount';
import logo from '../../assets/images/Lisk-Logo.svg';
import PrivateWrapper from '../privateWrapper';
import offlineStyle from '../offlineWrapper/offlineWrapper.css';
import styles from './header.css';
import RelativeLink from '../relativeLink';

const Header = props => (
  <header className={`${grid.row} ${grid['between-xs']} ${styles.wrapper}`}>
    <img src={logo} className={styles.logo} />
    <PrivateWrapper>
      <div className={grid.row}>
        <div className={styles.account}>
          <div className={styles.information} align="right">
            <div className={styles.balance}>
              <LiskAmount val={props.account.balance}/>
              <small> LSK</small>
            </div>
            <div className={`${styles.address} account-information-address`}>{props.account.address}</div>
            <div className={styles.timer}>
              {(!props.account.expireTime || props.account.expireTime === 0) ?
                <span><FontIcon value='locked' className={styles.lock}/> {props.t('Account locked!')}</span> :
                <div>
                  <FontIcon value='unlocked' className={styles.lock}/> {props.t('Address timeout in')} <i> </i>
                  <Countdown
                    date={props.account.expireTime}
                    renderer={CountDownTemplate}
                    onComplete={() => props.removePassphrase()}
                  />
                </div>}
            </div>
          </div>
          <RelativeLink to='saved-accounts'>
            <div className={styles.avatar}></div>
          </RelativeLink>
          <div className={styles.menu}>
            <figure className={styles.iconCircle}>
              <IconMenu
                className={`${styles.button} main-menu-icon-button ${offlineStyle.disableWhenOffline}`}
                icon={<FontIcon value='more' />}
                position="topRight"
                menuRipple
                theme={styles}
              >
                {
                  !props.account.isDelegate &&
              <MenuItem theme={styles}>
                <RelativeLink className={`register-as-delegate ${styles.link}`}
                  to='register-delegate'>{props.t('Register as delegate')}</RelativeLink>
              </MenuItem>
                }
                {
                  !props.account.secondSignature &&
              <MenuItem theme={styles}>
                <RelativeLink className={`register-second-passphrase ${styles.link}`}
                  to='register-second-passphrase'>{props.t('Register second passphrase')}</RelativeLink>
              </MenuItem>
                }
                <MenuItem theme={styles}>
                  <RelativeLink className={`sign-message ${styles.link}`} to='sign-message'>{props.t('Sign message')}</RelativeLink>
                </MenuItem>
                <MenuItem theme={styles}>
                  <RelativeLink className={`verify-message ${styles.link}`}
                    to='verify-message'>{props.t('Verify message')}</RelativeLink>
                </MenuItem>
                <MenuItem theme={styles}>
                  <RelativeLink className={`encrypt-message ${styles.link}`}
                    to='encrypt-message'>{props.t('Encrypt message')}</RelativeLink>
                </MenuItem>
                <MenuItem theme={styles}>
                  <RelativeLink className={`decrypt-message ${styles.link}`}
                    to='decrypt-message'>{props.t('Decrypt message')}</RelativeLink>
                </MenuItem>
                <MenuDivider />
                <MenuItem theme={styles}>
                  <RelativeLink className={`${styles.link} saved-accounts`}
                    to='saved-accounts'>{props.t('Saved accounts')}</RelativeLink>
                </MenuItem>
                <MenuItem theme={styles}>
                  <RelativeLink className={`settings ${styles.link}`} to='settings'>{props.t('Settings')}</RelativeLink>
                </MenuItem>
              </IconMenu>
            </figure>
          </div>
        </div>
      </div>
    </PrivateWrapper>
  </header>
);

export default Header;
