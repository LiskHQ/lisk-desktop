import React from 'react';
import Input from 'react-toolbox/lib/input';
import InfoParagraph from '../infoParagraph';
import ActionBar from '../actionBar';
import Fees from '../../constants/fees';
import AuthInputs from '../authInputs';
import { handleChange, authStatePrefill, authStateIsValid } from '../../utils/form';

class RegisterDelegate extends React.Component {
  constructor() {
    super();

    this.state = {
      name: {
        value: '',
      },
      ...authStatePrefill(),
    };
  }

  componentDidMount() {
    const newState = {
      name: {
        value: '',
      },
      ...authStatePrefill(this.props.account),
    };
    this.setState(newState);
  }

  register(event) {
    event.preventDefault();
    // @todo I'm not handling this part: this.setState({ nameError: error.message });
    this.props.delegateRegistered({
      activePeer: this.props.peers.data,
      account: this.props.account,
      username: this.state.name.value,
      passphrase: this.state.passphrase.value,
      secondPassphrase: this.state.secondPassphrase.value,
    });
  }

  render() {
    if (this.props.account.isDelegate) {
      return (
        <div>
          <InfoParagraph>
            {this.props.t('You have already registered as a delegate.')}
          </InfoParagraph>
        </div>
      );
    }

    return (
      <div>
        <form onSubmit={this.register.bind(this)}>
          <Input label={this.props.t('Delegate name')} required={true}
            autoFocus={true}
            className='username'
            onChange={handleChange.bind(this, 'name')}
            error={this.state.name.error}
            value={this.state.name.value} />
          <AuthInputs
            passphrase={this.state.passphrase}
            secondPassphrase={this.state.secondPassphrase}
            onChange={handleChange.bind(this)} />
          <hr/>
          <InfoParagraph>
            {this.props.t('Becoming a delegate requires registration. You may choose your own delegate name, which can be used to promote your delegate. Only the top 101 delegates are eligible to forge. All fees are shared equally between the top 101 delegates.')}
          </InfoParagraph>
          <ActionBar
            secondaryButton={{
              onClick: this.props.closeDialog,
            }}
            primaryButton={{
              label: this.props.t('Register'),
              fee: Fees.registerDelegate,
              type: 'submit',
              className: 'register-button',
              disabled: (!this.state.name.value ||
                this.props.account.isDelegate ||
                !authStateIsValid(this.state)),
            }} />
        </form>
      </div>
    );
  }
}

export default RegisterDelegate;
