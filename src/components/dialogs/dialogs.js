import React from 'react';
import Dialog from 'react-toolbox/lib/dialog';
import AppBar from 'react-toolbox/lib/app_bar';
import { IconButton } from 'react-toolbox/lib/button';
import Navigation from 'react-toolbox/lib/navigation';

import VerifyMessage from '../signVerify/verifyMessage';
import SignMessage from '../signVerify/signMessage';
import styles from './dialogs.css';

const Dialogs = props => (
  <div>
    {[
      {
        key: 'verify-message',
        title: 'Verify message',
        component: <VerifyMessage/>,
      }, {
        key: 'sign-message',
        title: 'Sign message',
        component: <SignMessage
                    closeDialog={props.closeDialog}
                    account={props.account}/>,
      },
    ].map(dialog => (
      <Dialog active={props.active === dialog.key} type='fullscreen' key={dialog.key}>
        <div className={styles.dialogs}>
          <AppBar title={dialog.title} flat={true}>
            <Navigation type='horizontal'>
              <IconButton className={`${styles['x-button']} x-button`} onClick={props.closeDialog} icon='close'/>
            </Navigation>
          </AppBar>
          {dialog.component}
        </div>
      </Dialog>
    ))
    }
  </div>
);

export default Dialogs;
