import React from 'react';
import MultiStep from '../multiStep';
import SignMessageInput from './signMessageInput';
import ConfirmMessage from './confirmMessage';

class SignMessage extends React.Component {
  render() {
    const { account, t, history } = this.props;
    const header = t('Sign a message');
    const message = t('You can use your passphrase to sign a message. ') +
      t('This signed message can prove that you are the owner of the account, since only your passphrase can produce it.') +
      t('We recommend including date & time or a specific keyword.');

    return (
      <MultiStep>
        <SignMessageInput t={t} header={header} message={message} history={history} />
        <ConfirmMessage t={t} account={account} />
      </MultiStep>
    );
  }
}

export default SignMessage;
