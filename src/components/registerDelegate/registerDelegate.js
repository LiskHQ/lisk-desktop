import React from 'react';
import Input from 'react-toolbox/lib/input';
import InfoParagraph from '../infoParagraph';
import ActionBar from '../actionBar';
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

  register(username, secondPassphrase) {
    // @todo I'm not handling this part: this.setState({ nameError: error.message });
    this.props.delegateRegistered({
      activePeer: this.props.peers.data,
      account: this.props.account,
      username,
      secondPassphrase,
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
                className='second-secret second-passphrase'
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
            onClick: this.props.closeDialog,
          }}
          primaryButton={{
            label: 'Register',
            fee: Fees.registerDelegate,
            className: 'register-button',
            disabled: !this.state.name ||
              this.props.account.isDelegate ||
              (this.props.account.secondSignature && !this.state.secondSecret),
            onClick: this.register.bind(this, this.state.name, this.state.secondSecret),
          }} />
      </div>
    );
  }
}

export default RegisterDelegate;
