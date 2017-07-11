import React from 'react';
import Input from 'react-toolbox/lib/input';
import FontIcon from 'react-toolbox/lib/font_icon';
import AppBar from 'react-toolbox/lib/app_bar';
import { Button, IconButton } from 'react-toolbox/lib/button';
import Navigation from 'react-toolbox/lib/navigation';
import PropTypes from 'prop-types';
import copy from 'copy-to-clipboard';
import { toastr } from 'react-redux-toastr';

import lisk from 'lisk-js';
import styles from './verifyMessage.css';
import dialogsStyles from '../dialogs/dialogs.css';
import grid from '../../../node_modules/flexboxgrid/dist/flexboxgrid.css';

class SignMessage extends React.Component {

  constructor() {
    super();
    this.state = {
      message: '',
      result: '',
    };
  }

  handleChange(message) {
    this.sign(message);
  }

  sign(message) {
    const signnedMessage = lisk.crypto.signMessageWithSecret(message,
      this.props.account.passphrase);
    const result = lisk.crypto.printSignedMessage(
      message, signnedMessage, this.props.account.publicKey);
    this.setState(Object.assign({}, this.state, { result, resultIsShown: false, message }));
  }

  showResult() {
    if (this.state.result) {
      const coppied = copy(this.state.result, {
        debug: true,
        message: 'Press #{key} to copy',
      });
      if (coppied) {
        // TODO: set up the toaster in redux
        // https://github.com/diegoddox/react-redux-toastr
        toastr.success('Result copied to clipboard');
      }
      this.setState(Object.assign({}, this.state, { resultIsShown: true }));
    }
  }

  render() {
    return (
      <div className='verify-message'>
          <AppBar title='Sign Message' flat={true}>
            <Navigation type='horizontal'>
              <IconButton className={`${dialogsStyles['x-button']} x-button`} onClick={this.props.closeDialog} icon='close'/>
            </Navigation>
          </AppBar>
          <div className='layout-row layout-align-center-center'>
            <span className='layout-padding layout-margin'>
              <FontIcon className='layout-margin' value='info' />
            </span>
            <p className='layout-padding layout-margin'>
              Signing a message with this tool indicates ownership of a privateKey (secret) and
              provides a level of proof that you are the owner of the key.
              Its important to bear in mind that this is not a 100% proof as computer systems
              can be compromised, but is still an effective tool for proving ownership
              of a particular publicKey/address pair.
              <br />
              Note: Digital Signatures and signed messages are not encrypted!
            </p>
          </div>
          <hr />
          <section>
            <Input className='message' multiline label='Message'
              autoFocus={true}
              value={this.state.message}
              onChange={this.handleChange.bind(this)} />
          </section>
          <section className={`${grid.row} ${grid['between-xs']}`}>
            <Button label='Cancel' className='cancel-button' onClick={this.props.closeDialog} />
            <Button label='Sign and copy result to clipboard'
              className='sign-button'
              primary={true} raised={true}
              disabled={!this.state.result || this.state.resultIsShown}
              onClick={this.showResult.bind(this)}/>
          </section>
          {this.state.resultIsShown ?
            <div className={styles.resultWrapper}>
              <h4>Result</h4>
              <Input className={`${styles.result} result`} multiline readOnly value={this.state.result} />
            </div> :
            null
          }
      </div>
    );
  }
}

SignMessage.propTypes = {
  closeDialog: PropTypes.func,
  account: PropTypes.object,
};

export default SignMessage;
