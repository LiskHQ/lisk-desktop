import { Button } from 'react-toolbox/lib/button';
import { IconMenu, MenuItem, MenuDivider } from 'react-toolbox/lib/menu';
import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import PrivateWrapper from '../privateWrapper';
import ReceiveButton from '../receiveButton';
import RegisterDelegate from '../registerDelegate';
import SecondPassphraseMenu from '../secondPassphrase';
import Send from '../send';
import SignMessage from '../signMessage';
import VerifyMessage from '../verifyMessage';
import logo from '../../assets/images/LISK-nano.png';
import offlineStyle from '../offlineWrapper/offlineWrapper.css';
import i18n from '../../i18n';
import SaveAccountButton from '../saveAccountButton';
import styles from './header.css';

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
            <MenuItem caption={props.t('Register as delegate')}
              className='register-as-delegate'
              onClick={() => props.setActiveDialog({
                title: props.t('Register as delegate'),
                childComponent: RegisterDelegate,
              })}
            />
        }
        <SecondPassphraseMenu />
        <MenuItem caption={props.t('Sign message')}
          className='sign-message'
          onClick={() => props.setActiveDialog({
            title: props.t('Sign message'),
            childComponentProps: {
              account: props.account,
            },
            childComponent: SignMessage,
          })}
        />
        <MenuItem caption={props.t('Verify message')}
          className='verify-message'
          onClick={() => props.setActiveDialog({
            title: props.t('Verify message'),
            childComponent: VerifyMessage,
          })}
        />
        <MenuDivider />
        <SaveAccountButton />
      </IconMenu>
      <Button className={`${styles.button} logout-button`} raised onClick={props.logOut}>{props.t('Logout')}</Button>
      <ReceiveButton className={styles.button} label='Receive' />
      <Button className={`${styles.button} send-button ${offlineStyle.disableWhenOffline}`}
        raised primary
        onClick={() => props.setActiveDialog({
          title: props.t('send'),
          childComponent: Send,
        })}>{props.t('send')}</Button>
        <IconMenu
          selectable={true}
          selected={i18n.language}
          className={`${styles.iconButton} ${offlineStyle.disableWhenOffline}`}
          icon='language' position='topRight'>
          <MenuItem value="en" caption='English'
            onClick={() => i18n.changeLanguage('en')} />
          <MenuItem value="de" caption='Deutsch'
            onClick={() => i18n.changeLanguage('de')} />
        </IconMenu>
    </PrivateWrapper>
  </header>
);

export default Header;
