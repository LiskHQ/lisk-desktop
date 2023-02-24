import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import DialogLink from 'src/theme/dialog/link';
import TokenAmount from 'src/modules/token/fungible/components/tokenAmount';
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
    <TokenAmount val={amount} token="LSK" />
  </span>
);

const AddApplicationRow = ({ data, className }) => (
    <div data-testid="applications-row" className={`application-row ${styles.container}`}>
      <DialogLink
        className={`${grid.row} ${className} blockchain-application-add-row`}
        component="blockChainApplicationDetails"
        data={{ chainId: data.chainID, mode: 'addApplication' }}
      >
        <ChainName title={data.name} logo={liskLogo} />
        <DepositAmount amount={data.depositedLsk} />
      </DialogLink>
    </div>
  );

export default AddApplicationRow;
