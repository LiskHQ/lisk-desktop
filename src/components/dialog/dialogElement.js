import React, { Component } from 'react';
import Dialog from 'react-toolbox/lib/dialog';
import Navigation from 'react-toolbox/lib/navigation';
import AppBar from 'react-toolbox/lib/app_bar';
import { IconButton } from 'react-toolbox/lib/button';
import styles from './dialog.css';


class DialogElement extends Component {
  constructor() {
    super();
    this.state = {};
  }

  closeDialog() {
    setTimeout(() => {
      this.props.onCancelClick();
      this.setState({ hidden: false });
    }, 500);
    this.setState({ hidden: true });
  }

  render() {
    return (
      <Dialog active={this.props.dialog.childComponent !== undefined && !this.state.hidden}
        theme={styles}
        type='fullscreen' className='modal-dialog'>
        <div className={styles.dialog}>
          <AppBar title={this.props.dialog.title} flat={true}
            className={styles[this.props.dialog.type]}>
            <Navigation type='horizontal'>
              <IconButton className={`${styles['x-button']} x-button`} onClick={this.closeDialog.bind(this)} icon='close'/>
            </Navigation>
          </AppBar>
          <div className='modal-dialog-body'>
            {this.props.dialog.childComponent ?
              <this.props.dialog.childComponent
                {...(this.props.dialog.childComponentProps || {})}
                closeDialog={this.closeDialog.bind(this)}
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
