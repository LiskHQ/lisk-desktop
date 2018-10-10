import React from 'react';
import { handleChange, authStatePrefill, authStateIsValid } from '../../utils/form';
import ActionBar from '../actionBar';
import AuthInputs from '../authInputs';
import InfoParagraph from '../infoParagraph';

class Authenticate extends React.Component {
  constructor() {
    super();
    this.state = {
      ...authStatePrefill(),
    };
    this.message = '';
  }

  componentDidMount() {
    const newState = {
      ...authStatePrefill(this.props.account),
    };
    this.setState(newState);
  }

  componentWillUpdate(props) {
    const { nextAction, t } = props;
    this.message = `${t('You are looking into a saved account. In order to {{nextAction}} you need to enter your passphrase.', { nextAction })}`;
  }

  update(e) {
    e.preventDefault();
    const data = {
      passphrase: this.state.passphrase.value,
    };
    if (typeof this.props.account.secondPublicKey === 'string') {
      data.secondPassphrase = this.state.secondPassphrase.value;
    }
    this.props.accountUpdated(data);
  }

  render() {
    return (
      <form>
        <InfoParagraph>
          {this.message}
        </InfoParagraph>

        <AuthInputs
          passphrase={this.state.passphrase}
          secondPassphrase={this.state.secondPassphrase}
          onChange={handleChange.bind(this)} />

        <ActionBar
          secondaryButton={{
            onClick: this.props.closeDialog,
          }}
          primaryButton={{
            label: this.props.t('Unlock account'),
            onClick: this.update.bind(this),
            className: 'authenticate-button',
            disabled: (!authStateIsValid(this.state)),
          }} />
      </form>);
  }
}

export default Authenticate;
