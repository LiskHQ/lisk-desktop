import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import Icon from 'src/theme/Icon';
import { TertiaryButton } from 'src/theme/buttons';
import WalletVisualWithAddress from '@wallet/components/walletVisualWithAddress';
import DialogLink from 'src/theme/dialog/link';
import styles from './SentVotesRow.css';

export const DelegateWalletVisual = ({ address, username }) => (
  <div className={`${styles.token} ${grid['col-xs-3']}`}>
    <WalletVisualWithAddress address={address} accountName={username} />
  </div>
);

export const Balance = ({ amount, ...rest }) => (
  <p className={`${grid['col-xs-2']} ${styles.balance}`} {...rest}>
    {amount}
  </p>
);

export const Actions = ({ address }) => (
  <div className={`${styles.action} ${grid['col-xs-3']}`}>
    <DialogLink component="lockedBalance" data={{ address }}>
      <Icon name="deleteIcon" />
    </DialogLink>
    <TertiaryButton>
      <Icon name="edit" />
    </TertiaryButton>
  </div>
);
