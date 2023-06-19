import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import Icon from 'src/theme/Icon';
import WalletVisualWithAddress from '@wallet/components/walletVisualWithAddress';
import routes from 'src/routes/routes';
import DialogLink from 'src/theme/dialog/link';
import classNames from 'classnames';
import styles from './SentStakesRow.css';

export const ValidatorWalletVisual = ({ address, name }) => (
  <div className={`${styles.addressWrapper} ${grid['col-xs-3']}`}>
    <Link to={`${routes.explorer.path}?address=${address}`}>
      <WalletVisualWithAddress size={40} address={address} accountName={name} />
    </Link>
  </div>
);

export const Balance = ({ className, colSpanXs = 2, value }) => (
  <div className={classNames(className, grid[`col-xs-${colSpanXs}`], styles.balance)}>{value}</div>
);

export const Actions = withRouter(({ address }) => (
  <div className={`${styles.action} ${grid['col-xs-2']}`}>
    <DialogLink component="editStake" data={{ address }}>
      <Icon name="edit" />
    </DialogLink>
  </div>
));
