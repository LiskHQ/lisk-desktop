import React from 'react';
import Dialog from 'react-toolbox/lib/dialog';
import PropTypes from 'prop-types';

import VerifyMessage from '../signVerify/verifyMessage';
import styles from './dialogs.css';

class Dialogs extends React.Component {
  render() {
    return (
      <div>
        <Dialog active={!!this.props.active} type='fullscreen' >
          <div className={styles.dialogs}>
            {(() => {
              switch (this.props.active) {
                case 'verify-message':
                  return <VerifyMessage closeDialog={this.props.closeDialog}/>;
                default :
                  return null;
              }
            })()}
          </div>
        </Dialog>
      </div>
    );
  }
}

Dialogs.propTypes = {
  active: PropTypes.string,
  closeDialog: PropTypes.func,
};

export default Dialogs;
