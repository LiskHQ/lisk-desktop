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
    this.routesReg = [
      {
        regex: /\/main\/transactions(?:\/[^/]*)?$/,
        path: '/main/transactions/',
        params: 'dialog',
        name: 'transactions',
      }, {
        regex: /\/main\/voting(?:\/[^/]*)?$/,
        path: '/main/voting/',
        params: 'dialog',
        name: 'voting',
      }, {
        regex: /\/main\/forging(?:\/[^/]*)?$/,
        path: '/main/forging/',
        params: 'dialog',
        name: 'forging',
      }, {
        regex: /\/(\w+)?$/,
        path: '/',
        params: 'dialog',
        name: 'login',
      },
    ];
    this.current = {
      pathname: '/',
      reg: this.routesReg[3],
      list: [],
      dialog: '',
    };
  }

  componentDidMount() {
    this.checkForDialog();
  }

  componentDidUpdate() {
    this.checkForDialog();
  }

  checkForDialog() {
    if (this.current.pathname !== this.props.history.location.pathname) {
      this.current.reg = this.routesReg.find(item =>
        item.regex.test(this.props.history.location.pathname));
      this.current.pathname = this.props.history.location.pathname;
      const dialogName = this.props.history.location.pathname.replace(this.current.reg.path, '');
      if (dialogs[dialogName] !== undefined) {
        this.open(this.current.reg, dialogs[dialogName]);
      } else {
        this.close();
      }
    }
  }

  // eslint-disable-next-line class-methods-use-this
  parseParams(search) {
    return search.replace(/^\?/, '').split('&&').reduce((acc, param) => {
      const keyValue = param.split('=');
      if (keyValue[0] !== '' && keyValue[1] !== 'undefined') {
        acc[keyValue[0]] = keyValue[1];
      }
      return acc;
    }, {});
  }

  open(config, dialog) {
    clearTimeout(this.timeout);
    this.setState({ hidden: false });
    this.props.dialogDisplayed({
      title: dialog.title,
      childComponent: dialog.component,
      childComponentProps: this.parseParams(this.props.history.location.search),
    });
  }

  close() {
    this.timeout = setTimeout(() => {
      this.props.dialogHidden();
      this.setState({ hidden: false });
    }, 500);
    this.setState({ hidden: true });
  }

  goBack() {
    this.props.history.push(this.current.reg.path);
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
              <IconButton className={`${styles['x-button']} x-button`} onClick={this.goBack.bind(this)} icon='close'/>
            </Navigation>
          </AppBar>
          <div className='modal-dialog-body'>
            {this.props.dialog.childComponent ?
              <this.props.dialog.childComponent
                {...(this.props.dialog.childComponentProps || {})}
                closeDialog={this.goBack.bind(this)}
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
