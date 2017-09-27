import React from 'react';
import InfoParagraph from '../infoParagraph';
import ActionBar from '../actionBar';
import networksRaw from '../login/networks';

const SaveAccount = ({
  network,
  address,
  publicKey,
  closeDialog,
  accountSaved,
}) => {
  const save = () => {
    // eslint-disable-next-line arrow-body-style
    const index = networksRaw.map((item, i) => {
      return (item.name === network) ? i : null;
    }).find(item => item !== null);
    accountSaved({
      network: index,
      address,
      publicKey,
    });
    closeDialog();
  };

  return (
    <div className='save-account'>
      <InfoParagraph>
        This will save public key of your account on this device,
        so next time it will launch without the need to log in.
        However, you will be prompted to enter the passphrase once
        you want to do any transaction.
      </InfoParagraph>
      <ActionBar
        secondaryButton={{
          onClick: closeDialog,
        }}
        primaryButton={{
          label: 'Save account',
          className: 'save-account-button',
          onClick: save.bind(this),
        }} />
    </div>
  );
};

export default SaveAccount;
