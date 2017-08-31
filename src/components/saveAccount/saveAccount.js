import React from 'react';
import InfoParagraph from '../infoParagraph';
import ActionBar from '../actionBar';

export default class SaveAccount extends React.Component {
  save() {
    localStorage.setItem('accounts', JSON.stringify([{
      publicKey: this.props.account.publicKey,
      network: localStorage.getItem('network'),
      address: localStorage.getItem('address'),
    }]));
    this.props.closeDialog();
    this.props.successToast({ label: 'Account saved' });
  }

  render() {
    return (
      <div className='save-account'>
        <InfoParagraph>
          This will save public key of your account on this device,
          so next time it will launch without the need to log in.
          However, you will be propted to enter the passphrase once
          you want to do any transaction.
        </InfoParagraph>
        <ActionBar
          secondaryButton={{
            onClick: this.props.closeDialog,
          }}
          primaryButton={{
            label: 'Save account',
            className: 'save-button',
            onClick: this.save.bind(this),
          }} />
      </div>
    );
  }
}

