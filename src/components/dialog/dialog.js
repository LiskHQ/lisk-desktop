import React, { Component } from 'react';
import Dialog from 'react-toolbox/lib/dialog';
// import { parseSearchParams } from '../../utils/searchParams';
import styles from './dialog.css';

class DialogElement extends Component {
  constructor() {
    super();
    this.state = {};
  }

  // componentDidUpdate() {
  //   this.open();
  // }

  // open() {
  //   clearTimeout(this.timeout);
  //   this.setState({ hidden: false });
  //   this.props.dialogDisplayed({
  //     title: this.props.dialog.title,
  //     theme: this.props.dialog.theme,
  //     childComponent: this.props.dialog.childComponent,
  //     childComponentProps: parseSearchParams(this.props.history.location.search),
  //   });
  // }

  // close() {
  //   this.timeout = setTimeout(() => {
  //     this.props.dialogHidden();
  //     this.setState({ hidden: false });
  //   }, 500);
  //   this.setState({ hidden: true });
  // }

  // goBack() {
  //   this.close();
  //   this.props.history.goBack();
  // }

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
          {/* { this.props.dialog.title ?
            <AppBar title={this.props.dialog.title} flat={true}
              className={styles[this.props.dialog.type]}>
              <Navigation type='horizontal'>
                <IconButton className={`${styles['x-button']} x-button`}
                  onClick={this.goBack.bind(this)} icon='close'/>
              </Navigation>
            </AppBar> :
            null } */}
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
