import React from 'react';
import { withRouter } from 'react-router-dom';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import Icon from 'src/theme/Icon';
import WalletVisualWithAddress from '@wallet/components/walletVisualWithAddress';
import { addSearchParamsToUrl } from 'src/utils/searchParams';
import DialogLink from 'src/theme/dialog/link';
import classNames from 'classnames';
import styles from './SentStakesRow.css';

export const ValidatorWalletVisual = ({ address, name }) => (
  <div className={`${styles.addressWrapper} ${grid['col-xs-3']}`}>
    <WalletVisualWithAddress size={40} address={address} accountName={name} />
  </div>
);

export const Balance = ({ className, colSpanXs = 2, value }) => (
  <div className={classNames(className, grid[`col-xs-${colSpanXs}`], styles.balance)}>
    {value}
  </div>
);

export const Actions = withRouter (({ history, address, name, stakeEdited }) => {
  const handleRemoveStake = () => {
    stakeEdited([
      {
        name,
        address,
        amount: 0,
      },
    ]);
    addSearchParamsToUrl(history, { modal: 'editStake', address });
  };

  return (
    <div className={`${styles.action} ${grid['col-xs-2']}`}>
      <DialogLink component="editStake" data={{ address }}>
        <Icon name="edit" />
      </DialogLink>
      <button
        onClick={handleRemoveStake}
      >
        <Icon name="deleteIcon" />
      </button>
    </div>
  );
});
