import React from 'react';
import Dialog from 'react-toolbox/lib/dialog';
import PropTypes from 'prop-types';
import AppBar from 'react-toolbox/lib/app_bar';
import { IconButton } from 'react-toolbox/lib/button';
import Navigation from 'react-toolbox/lib/navigation';

import VerifyMessage from '../signVerify/verifyMessage';
import SignMessage from '../signVerify/signMessage';
import styles from './dialogs.css';

class Dialogs extends React.Component {
  render() {
    return (
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
                        closeDialog={this.props.closeDialog}
                        account={this.props.account}/>,
          },
        ].map(dialog => (
          <Dialog active={this.props.active === dialog.key} type='fullscreen' key={dialog.key}>
            <div className={styles.dialogs}>
              <AppBar title={dialog.title} flat={true}>
                <Navigation type='horizontal'>
                  <IconButton className={`${styles['x-button']} x-button`} onClick={this.props.closeDialog} icon='close'/>
                </Navigation>
              </AppBar>
              {dialog.component}
            </div>
          </Dialog>
        ))
        }
      </div>
    );
  }
}

Dialogs.propTypes = {
  active: PropTypes.string,
  closeDialog: PropTypes.func,
  account: PropTypes.object,
};

export default Dialogs;
