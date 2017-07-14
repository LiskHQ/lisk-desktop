import React from 'react';
import Input from 'react-toolbox/lib/input';
import Button from 'react-toolbox/lib/button';
import copy from 'copy-to-clipboard';
import { toastr } from 'react-redux-toastr';

import lisk from 'lisk-js';
import InfoParagraph from '../infoParagraph';
import SignVerifyResult from './signVerifyResult';
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
    const signedMessage = lisk.crypto.signMessageWithSecret(message,
      this.props.account.passphrase);
    const result = lisk.crypto.printSignedMessage(
      message, signedMessage, this.props.account.publicKey);
    this.setState(Object.assign({}, this.state, { result, resultIsShown: false, message }));
  }

  showResult() {
    if (this.state.result) {
      const copied = copy(this.state.result, {
        debug: true,
        message: 'Press #{key} to copy',
      });
      if (copied) {
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
          <InfoParagraph>
              Signing a message with this tool indicates ownership of a privateKey (secret) and
              provides a level of proof that you are the owner of the key.
              Its important to bear in mind that this is not a 100% proof as computer systems
              can be compromised, but is still an effective tool for proving ownership
              of a particular publicKey/address pair.
              <br />
              Note: Digital Signatures and signed messages are not encrypted!
          </InfoParagraph>
          <section>
            <Input className='message' multiline label='Message'
              autoFocus={true}
              value={this.state.message}
              onChange={this.handleChange.bind(this)} />
          </section>
          {this.state.resultIsShown ?
            <SignVerifyResult result={this.state.result} title='Result' /> :
            <section className={`${grid.row} ${grid['between-xs']}`}>
              <Button label='Cancel' className='cancel-button' onClick={this.props.closeDialog} />
              <Button label='Sign and copy result to clipboard'
                className='sign-button'
                primary={true} raised={true}
                disabled={!this.state.result || this.state.resultIsShown}
                onClick={this.showResult.bind(this)}/>
          </section>
          }
      </div>
    );
  }
}

export default SignMessage;
