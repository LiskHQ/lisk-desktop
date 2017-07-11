import React from 'react';
import Dialog from 'react-toolbox/lib/dialog';
import PropTypes from 'prop-types';

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
            component: <VerifyMessage closeDialog={this.props.closeDialog}/>,
          }, {
            key: 'sign-message',
            component: <SignMessage
                        closeDialog={this.props.closeDialog}
                        account={this.props.account}/>,
          },
        ].map(dialog => (
          <Dialog active={this.props.active === dialog.key} type='fullscreen' key={dialog.key}>
            <div className={styles.dialogs}>
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
