import React, { Component } from 'react';
import Dialog from 'react-toolbox/lib/dialog';
import Navigation from 'react-toolbox/lib/navigation';
import AppBar from 'react-toolbox/lib/app_bar';
import { IconButton } from 'react-toolbox/lib/button';
import { parseSearchParams } from '../../utils/searchParams';
import styles from './dialog.css';
import getDialogs from './dialogs';
import routesReg from '../../utils/routes';

class DialogElement extends Component {
  constructor() {
    super();
    this.state = {};
    this.current = {
      pathname: '/',
      reg: routesReg[3],
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
    // if the dialog is wrong, show a toast
    if (this.current.pathname !== this.props.history.location.pathname) {
      this.current.reg = routesReg.find(item =>
        item.regex.test(this.props.history.location.pathname));
      this.current.pathname = this.props.history.location.pathname;
      const dialogName = this.props.history.location.pathname.replace(this.current.reg.path, '');
      const dialogs = getDialogs();
      if (dialogs[dialogName] !== undefined) {
        this.open(this.current.reg, dialogs[dialogName]);
      } else {
        this.close();
      }
    }
  }

  open(config, dialog) {
    clearTimeout(this.timeout);
    this.setState({ hidden: false });
    this.props.dialogDisplayed({
      title: dialog.title,
      childComponent: dialog.component,
      childComponentProps: parseSearchParams(this.props.history.location.search),
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
          <div className={`modal-dialog-body ${styles.innerBody}`}>
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
