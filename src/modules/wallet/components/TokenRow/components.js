import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import Icon from 'src/theme/Icon';
import DialogLink from 'src/theme/dialog/link';
import DiscreetMode from '@common/components/discreetMode';
import styles from './TokenRow.css';
import chainImage from '../../../../../setup/react/assets/images/LISK.png';

export const Token = ({ tokenSymbol, chainName, chainLogo = chainImage }) => (
  <div className={`${styles.token} ${grid['col-xs-3']}`}>
    <img alt={tokenSymbol} src={chainLogo} />
    <div>
      <p>{tokenSymbol}</p>
      <span>{chainName}</span>
    </div>
  </div>
);

export const Balance = ({ amount, Wrapper = DiscreetMode, ...rest }) => (
  <Wrapper className={`${grid['col-xs-2']} ${styles.balance}`} {...rest}>
    {amount}
  </Wrapper>
);

export const LockedBalance = ({ amount, address }) => (
  <div className={`${styles.lockedBalance} ${grid['col-xs-3']}`}>
    <p className={styles.balance}>
      <DiscreetMode>{amount}</DiscreetMode>
    </p>
    <DialogLink component="lockedBalance" data={{ address }}>
      <Icon name="arrowRightInactive" />
    </DialogLink>
  </div>
);
