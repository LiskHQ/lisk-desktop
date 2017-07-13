import React from 'react';
import { Button } from 'react-toolbox/lib/button';
import { IconMenu, MenuItem } from 'react-toolbox/lib/menu';
import logo from '../../assets/images/LISK-nano.png';
import styles from './header.css';
import store from '../../store';
import { dialogDisplayed } from '../../actions/dialog';
import VerifyMessage from '../signVerify/verifyMessage';
import SignMessage from '../signVerify/signMessage';

const Header = props => (
  <header className={styles.wrapper}>
    <img className={styles.logo} src={logo} alt="logo" />
    <IconMenu
      className={`${styles.iconButton} main-menu-icon-button`}
      icon="more_vert"
      position="topRight"
      menuRipple
      theme={styles}
    >
      <MenuItem caption="Register second passphrase" />
      <MenuItem caption="Register as delegate" />
      <MenuItem caption="Sign message"
        className='sign-message'
        onClick={() => store.dispatch(
          dialogDisplayed({
            title: 'Sign message',
            childComponentProps: {
              account: props.account,
            },
            childComponent: SignMessage,
          }),
        )}
      />
      <MenuItem caption="Verify message"
        className='verify-message'
        onClick={() => store.dispatch(
          dialogDisplayed({
            title: 'Verify message',
            childComponent: VerifyMessage,
          }),
        )}
      />
    </IconMenu>
    <Button className={styles.button} raised>logout</Button>
    <Button className={styles.button} raised primary>send</Button>
  </header>
);

export default Header;
