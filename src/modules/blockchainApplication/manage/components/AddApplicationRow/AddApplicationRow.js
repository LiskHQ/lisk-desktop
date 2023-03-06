import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import TokenAmount from '@token/fungible/components/tokenAmount';
import DialogLink from 'src/theme/dialog/link';
import liskLogo from '../../../../../../setup/react/assets/images/LISK.png';
import styles from './AddApplicationRow.css';

const ChainName = ({ title, logo }) => (
  <div className={`chain-name ${grid['col-xs-6']} ${styles.chainName}`}>
    <img src={logo} />
    <span>{title}</span>
  </div>
);

const DepositAmount = ({ amount }) => (
  <span className={`deposit-amount ${styles.amount} ${grid['col-xs-6']}`}>
    <TokenAmount isLsk val={amount} />
  </span>
);

const AddApplicationRow = ({ data, className }) => (
  <div data-testid="applications-row" className={`application-row ${styles.container}`}>
    <DialogLink
      className={`${grid.row} ${className} blockchain-application-add-row`}
      component="blockChainApplicationDetails"
      data={{ chainId: data.chainID, mode: 'addApplication' }}
    >
      <ChainName title={data.chainName} logo={liskLogo} />
      <DepositAmount amount={data.depositedLsk} />
    </DialogLink>
  </div>
);

export default AddApplicationRow;
