import { IconMenu, MenuItem, MenuDivider } from 'react-toolbox/lib/menu';
import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import Countdown from 'react-countdown-now';
import { Button } from '../toolbox/buttons/button';

import LiskAmount from '../liskAmount';
import PrivateWrapper from '../privateWrapper';
import offlineStyle from '../offlineWrapper/offlineWrapper.css';
import styles from './header.css';
import RelativeLink from '../relativeLink';
import lock from './../../assets/images/lock-open.svg';

// Renderer callback with condition 
const renderer = ({ minutes, seconds }) => {
  // Render a countdown 
  const min = minutes < 10 ? `0${minutes}` : minutes;
  const sec = seconds < 10 ? `0${seconds}` : seconds;
  return <span>{min}:{sec}</span>;
};

const Header = (props) => {
  const { lastActivated } = props.account;
  const finalTime = Date.now() + lastActivated;
  return (
    <header className={`${grid.row} ${grid['between-xs']} ${styles.wrapper}`}>
      <PrivateWrapper>
        <div className={grid.row}>
          <Button className={`${styles.logoutButton} logout-button`} raised onClick={props.logOut}>{props.t('LOGOUT')}</Button>
          <div className={styles.account}>
            <div className={styles.information} align="right">
              <div className={styles.balance}>
                <LiskAmount val={props.account.balance}/> LSK
              </div>
              <div className={`${styles.address} account-information-address`}>{props.account.address}</div>
              <div className={styles.timer}>
                <img src={lock} /> Address timeout in <i> </i>
                {lastActivated === 0 ?
                  '00:00' :
                  <Countdown
                    date={finalTime}
                    renderer={renderer}
                    onComplete={() => props.removePassphrase()}
                  />
                }
              </div>
            </div>
            <div className={styles.avatar}></div>
            <div className={styles.menu}>
              <figure className={styles.iconCircle}>
                <IconMenu
                  className={`${styles.button} main-menu-icon-button ${offlineStyle.disableWhenOffline}`}
                  icon="favorite"
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
};

export default Header;
