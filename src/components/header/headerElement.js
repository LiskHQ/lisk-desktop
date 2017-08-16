import React from 'react';
import { Button } from 'react-toolbox/lib/button';
import { IconMenu, MenuItem } from 'react-toolbox/lib/menu';
import logo from '../../assets/images/LISK-nano.png';
import styles from './header.css';
import VerifyMessage from '../signVerify/verifyMessage';
import SignMessage from '../signVerify/signMessage';
import RegisterDelegate from '../registerDelegate';
import Send from '../send';
import PrivateWrapper from '../privateWrapper';
import SecondPassphraseMenu from '../secondPassphrase';
import OfflineWrapper from '../offlineWrapper';

const HeaderElement = props => (
  <header className={styles.wrapper}>
    <img className={styles.logo} src={logo} alt="logo" />
    <PrivateWrapper>
      <OfflineWrapper>
        <IconMenu
          className={`${styles.iconButton} main-menu-icon-button`}
          icon="more_vert"
          position="topRight"
          menuRipple
          theme={styles}
        >
          {
            !props.account.isDelegate &&
              <MenuItem caption="Register as delegate"
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
      </OfflineWrapper>
      <Button className={`${styles.button} logout-button`} raised onClick={props.logOut}>logout</Button>
      <OfflineWrapper>
        <Button className={`${styles.button} send-button`}
          raised primary
          onClick={() => props.setActiveDialog({
            title: 'Send',
            childComponent: Send,
          })}>Send</Button>
      </OfflineWrapper>
      </PrivateWrapper>
  </header>
);

export default HeaderElement;
