import React, { Component } from 'react';
import Dialog from 'react-toolbox/lib/dialog';
import Navigation from 'react-toolbox/lib/navigation';
import AppBar from 'react-toolbox/lib/app_bar';
import { IconButton } from 'react-toolbox/lib/button';
import styles from './dialog.css';
import dialogs from './dialogs';

class DialogElement extends Component {
  constructor() {
    super();
    this.state = {};
    this.path = {
      name: '/',
      list: [],
    };
  }

  componentDidMount() {
    this.checkForDialog(this.props.history.location);
  }

  componentDidUpdate() {
    if (this.path.name !== this.props.history.location.pathname) {
      this.path.name = this.props.history.location.pathname;
      this.checkForDialog(this.props.history.location);
    }
  }

  checkForDialog(location) {
    const parseParams = search => search.replace(/^\?/, '').split('&&').reduce((acc, param) => {
      const keyValue = param.split('=');
      if (keyValue[0] !== '' && keyValue[1] !== 'undefined') {
        acc[keyValue[0]] = keyValue[1];
      }
      return acc;
    }, {});

    this.path.list = location.pathname.split('/');

    if (this.path.list.length === 4 && Object.keys(dialogs).includes(this.path.list[3])) {
      this.routeWithDialog(dialogs[this.path.list[3]], parseParams(location.search));
    } else {
      this.routeWithOutDialog();
    }
  }

  routeWithDialog(dialog, childComponentProps) {
    this.props.dialogDisplayed({
      title: dialog.title,
      childComponent: dialog.component,
      childComponentProps,
    });
  }

  routeWithOutDialog() {
    setTimeout(() => {
      this.props.dialogHidden();
      this.setState({ hidden: false });
    }, 500);
    this.setState({ hidden: true });
  }

  closeDialog() {
    this.props.history.push(`/${this.path.list[1]}/${this.path.list[2]}`);
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
