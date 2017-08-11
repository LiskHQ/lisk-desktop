import React from 'react';
import Input from 'react-toolbox/lib/input';
import InfoParagraph from '../infoParagraph';
import ActionBar from '../actionBar';
import { registerDelegate } from '../../utils/api/delegate';
import Fees from '../../constants/fees';

class RegisterDelegate extends React.Component {
  constructor() {
    super();

    this.state = {
      name: '',
      nameError: '',
    };
  }

  changeHandler(name, value) {
    this.setState({ [name]: value });
  }

  register(username, secondSecret) {
    registerDelegate(this.props.peers.data, username,
      this.props.account.passphrase, secondSecret)
      .then((data) => {
        this.props.showSuccessAlert({
          text: `Delegate registration was successfully submitted with username: "${this.state.name}". It can take several seconds before it is processed.`,
        });

        // add to pending transaction
        this.props.addTransaction({
          id: data.transactionId,
          senderPublicKey: this.props.account.publicKey,
          senderId: this.props.account.address,
          amount: 0,
          fee: Fees.registerDelegate,
        });
      })
      .catch((error) => {
        if (error && error.message === 'Username already exists') {
          this.setState({ nameError: error.message });
        } else {
          this.props.showErrorAlert({
            text: error && error.message ? `${error.message}.` : 'An error occurred while registering as delegate.',
          });
        }
      });
  }

  render() {
    return (
      <div>
        <Input label='Delegate name' required={true}
          autoFocus={true}
          className='username'
          onChange={this.changeHandler.bind(this, 'name')}
          error={this.state.nameError}
          value={this.state.name} />
          {
             this.props.account.secondSignature &&
              <Input label='Second secret'
                required={true}
                className='second-secret'
                onChange={this.changeHandler.bind(this, 'secondSecret')}
                value={this.state.secondSecret} />
          }
        <hr/>
        <InfoParagraph>
          Becoming a delegate requires registration. You may choose your own
          delegate name, which can be used to promote your delegate. Only the
          top 101 delegates are eligible to forge. All fees are shared equally
          between the top 101 delegates.
        </InfoParagraph>
        <ActionBar
          secondaryButton={{
            onClick: this.props.closeDialog.bind(this),
          }}
          primaryButton={{
            label: 'Register',
            fee: Fees.registerDelegate,
            disabled: !this.state.name ||
              (this.props.account.secondSignature && !this.state.secondSecret),
            onClick: this.register.bind(this, this.state.name, this.state.secondSecret),
          }} />
      </div>
    );
  }
}

export default RegisterDelegate;
