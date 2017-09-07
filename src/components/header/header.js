import React from 'react';
import { Button } from 'react-toolbox/lib/button';
import { IconMenu, MenuItem } from 'react-toolbox/lib/menu';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import logo from '../../assets/images/LISK-nano.png';
import styles from './header.css';
import VerifyMessage from '../verifyMessage';
import SignMessage from '../signMessage';
import RegisterDelegate from '../registerDelegate';
import Send from '../send';
import PrivateWrapper from '../privateWrapper';
import SecondPassphraseMenu from '../secondPassphrase';
import offlineStyle from '../offlineWrapper/offlineWrapper.css';

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
            <MenuItem caption="Register as delegate"
              className='register-as-delegate'
              onClick={() => props.setActiveDialog({
                title: 'Register as delegate',
                childComponent: RegisterDelegate,
              })}
            />
        }
        <SecondPassphraseMenu />
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
      <Button className={`${styles.button} send-button ${offlineStyle.disableWhenOffline}`}
        raised primary
        onClick={() => props.setActiveDialog({
          title: 'Send',
          childComponent: Send,
        })}>Send</Button>
    </PrivateWrapper>
  </header>
);

export default Header;
