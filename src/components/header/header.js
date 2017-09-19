import { Button } from 'react-toolbox/lib/button';
import { IconMenu, MenuItem } from 'react-toolbox/lib/menu';
import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import buttonStyle from 'react-toolbox/lib/button/theme.css';
import logo from '../../assets/images/LISK-nano.png';
import styles from './header.css';
import PrivateWrapper from '../privateWrapper';
import offlineStyle from '../offlineWrapper/offlineWrapper.css';
import RelativeLink from '../relativeLink';
import ReceiveButton from '../receiveButton';

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
              <RelativeLink className={styles.menuItem}
                to='register-delegate'>Register as delegate</RelativeLink>
            </MenuItem>
        }
        {
          !props.account.secondSignature &&
            <MenuItem>
              <RelativeLink className={styles.menuItem}
                to='register-second-passphrase'>Register second passphrase</RelativeLink>
            </MenuItem>
        }
        <MenuItem>
          <RelativeLink className={styles.menuItem} to='sign-message'>Sign message</RelativeLink>
        </MenuItem>
        <MenuItem>
          <RelativeLink className={styles.menuItem}
            to='verify-message'>Verify message</RelativeLink>
        </MenuItem>
      </IconMenu>

      <Button className={`${styles.button} logout-button`} raised onClick={props.logOut}>{props.t('logout')}</Button>
      <RelativeLink className={`${styles.button} ${buttonStyle.button} ${buttonStyle.primary} ${buttonStyle.raised} receive-button ${offlineStyle.disableWhenOffline}`}
      to='receive'>{props.t('Receive LSK')}</RelativeLink>
      <RelativeLink className={`${styles.button} ${buttonStyle.button} ${buttonStyle.primary} ${buttonStyle.raised} send-button ${offlineStyle.disableWhenOffline}`}
      to='send'>{props.t('send')}</RelativeLink>
    </PrivateWrapper>
  </header>
);

export default Header;
