import React from 'react';
import { Button } from 'react-toolbox/lib/button';
import { IconMenu, MenuItem } from 'react-toolbox/lib/menu';
import logo from '../../assets/images/LISK-nano.png';
import styles from './header.css';
import VerifyMessage from '../signVerify/verifyMessage';
import SignMessage from '../signVerify/signMessage';
import Send from '../send';
import PrivateWrapper from '../privateWrapper';

const HeaderElement = props => (
  <header className={styles.wrapper}>
    <img className={styles.logo} src={logo} alt="logo" />
    <PrivateWrapper>
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
          onClick={() => props.setActiveDialog({
            title: 'Sign message',
            childComponentProps: {
              account: props.account,
            },
            childComponent: SignMessage,
          })}
        />
        <MenuItem caption="Verify message"
          className='verify-message'
          onClick={() => props.setActiveDialog({
            title: 'Verify message',
            childComponent: VerifyMessage,
          })}
        />
      </IconMenu>
      <Button className={`${styles.button} logout-button`} raised onClick={props.logOut}>logout</Button>
      <Button className={`${styles.button} send-button`}
        raised primary
        onClick={() => props.setActiveDialog({
          title: 'Send',
          childComponent: Send,
        })}>Send</Button>
      </PrivateWrapper>
  </header>
);

export default HeaderElement;
