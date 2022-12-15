import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import Icon from 'src/theme/Icon';
import WalletVisualWithAddress from '@wallet/components/walletVisualWithAddress';
import DialogLink from 'src/theme/dialog/link';
import styles from './SentStakesRow.css';

export const ValidatorWalletVisual = ({ address, name }) => (
  <div className={`${styles.addressWrapper} ${grid['col-xs-3']}`}>
    <WalletVisualWithAddress size={40} address={address} accountName={name} />
  </div>
);

export const Balance = ({ value, ...rest }) => (
  <p className={`${grid['col-xs-2']} ${styles.balance}`} {...rest}>
    {value}
  </p>
);

export const Actions = ({ address, name, stakeEdited }) => {
  const handleRemoveVote = () => {
    stakeEdited([
      {
        name,
        address,
        amount: 0,
      },
    ]);
  };

  return (
    <div className={`${styles.action} ${grid['col-xs-3']}`}>
      <DialogLink component="editStake" data={{ address }}>
        <Icon name="edit" />
      </DialogLink>
      <button
        onClick={handleRemoveVote}
      >
        <Icon name="deleteIcon" />
      </button>
    </div>
  );
};
