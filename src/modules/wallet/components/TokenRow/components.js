import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
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

export const Balance = ({ amount, Wrapper = DiscreetMode }) => (
  <Wrapper className={`${grid['col-xs-2']} ${styles.balance}`}>
    {amount}
  </Wrapper>
);
