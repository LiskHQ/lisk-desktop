import React, { Component } from 'react';
import Dialog from 'react-toolbox/lib/dialog';

import styles from './dialog.css';

class DialogElement extends Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    const theme = {
      ...styles,
      ...(this.props.dialog.theme || {}),
    };

    const { childComponentProps } = this.props.dialog;
    return (
      <Dialog active={this.props.dialog.childComponent !== undefined && !this.state.hidden}
        theme={theme}
        type='fullscreen' className='modal-dialog'>
        <div className={styles.dialog}>
          <div className={`modal-dialog-body ${theme.innerBody}`}>
            <div className={styles.title}>{childComponentProps && childComponentProps.title}</div>
            {this.props.dialog.childComponent ?
              <this.props.dialog.childComponent
                {...(this.props.dialog.childComponentProps || {})}
              /> :
              null
            }
          </div>
        </div>
      </Dialog>
    );
  }
}

export default DialogElement;
