import React from 'react';
import Input from 'react-toolbox/lib/input';
import FontIcon from 'react-toolbox/lib/font_icon';
import AppBar from 'react-toolbox/lib/app_bar';
import { IconButton } from 'react-toolbox/lib/button';
import Navigation from 'react-toolbox/lib/navigation';
import PropTypes from 'prop-types';

import lisk from 'lisk-js';
import styles from './verifyMessage.css';
import dialogsStyles from '../dialogs/dialogs.css';

class VerifyMessage extends React.Component {

  constructor() {
    super();
    this.state = {
      publicKey: {
        error: '',
        value: '',
      },
      signature: {
        error: '',
        value: '',
      },
      result: '',
    };
  }

  handleChange(name, value) {
    const newState = Object.assign({}, this.state);
    newState[name].value = value;
    this.setState(newState);
    this.verify();
  }

  verify() {
    const newState = Object.assign({}, this.state);
    newState.publicKey.error = '';
    newState.signature.error = '';
    newState.result = '';
    try {
      newState.result = lisk.crypto.verifyMessageWithPublicKey(
        this.state.signature.value, this.state.publicKey.value);
      if (this.state.result && this.state.result.message) {
        throw newState.result;
      }
    } catch (e) {
      if (e.message.indexOf('Invalid publicKey') !== -1 && this.state.publicKey.value) {
        newState.publicKey.error = 'Invalid';
      } else if (e.message.indexOf('Invalid signature') !== -1 && this.state.signature.value) {
        newState.signature.error = 'Invalid';
      }
      newState.result = '';
    }
    this.setState(newState);
  }

  render() {
    return (
      <div className='verify-message'>
          <AppBar title="Verify Message" flat={true}>
            <Navigation type='horizontal'>
              <IconButton className={dialogsStyles['x-button']} onClick={this.props.closeDialog} icon='close'/>
            </Navigation>
          </AppBar>
          <div className='layout-row layout-align-center-center'>
            <span className='layout-padding layout-margin'>
              <FontIcon className='layout-margin' value='info' />
            </span>
            <p className='layout-padding layout-margin'>
              When you have the signature, you only need the publicKey of the signer
              in order to verify that the message came from the right private/publicKey pair.
              Be aware, everybody knowing the signature and the publicKey can verify the message.
              If ever there is a dispute, everybody can take the publicKey and signature to a judge
              and prove that the message is coming from the specific private/publicKey pair.
            </p>
          </div>
          <hr />
          <section>
            <Input className='public-key' type='text' label='Public Key'
              autoFocus="true"
              value={this.state.publicKey.value}
              error={this.state.publicKey.error}
              onChange={this.handleChange.bind(this, 'publicKey')} />
            <Input className='signature' multiline label='Signature'
              value={this.state.signature.value}
              error={this.state.signature.error}
              onChange={this.handleChange.bind(this, 'signature')} />
          </section>
          {this.state.result ?
            <div className={styles.resultWrapper}>
              <h4>Original Message</h4>
              <Input className={styles.result} multiline readOnly value={this.state.result} />
            </div> :
            null
          }
      </div>
    );
  }
}

VerifyMessage.propTypes = {
  closeDialog: PropTypes.func,
};

export default VerifyMessage;
