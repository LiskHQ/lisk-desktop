import React from 'react';
import MultiStep from '../multiStep';
import SignMessageInput from './signMessageInput';
import ConfirmMessage from './confirmMessage';

class SignMessage extends React.Component {
  render() {
    const { account, t, history } = this.props;
    return (
      <MultiStep>
        <SignMessageInput t={t} history={history} />
        <ConfirmMessage t={t} account={account} />
      </MultiStep>
    );
  }
}

export default SignMessage;
