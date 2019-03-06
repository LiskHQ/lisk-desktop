import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import TransactionOverviewV2 from '../transactionsV2/transactionsOverviewV2';
import BalanceChart from './balanceChart';
import WalletDetails from './walletDetails';

const WalletTab = ({ ...props }) => (
  <React.Fragment>
    {props.detailAccount ? (
      <div className={`${grid.row}`}>
        <div className={`${grid['col-sm-4']} ${grid['col-lg-3']}`}>
          <WalletDetails
            peers={props.peers}
            lastTransaction={props.transaction}
            loadLastTransaction={props.loadLastTransaction}
            balance={props.balance}
            address={props.address}
            wallets={props.wallets}
            />
        </div>
        <div className={`${grid['col-sm-8']} ${grid['col-lg-9']}`}>
        { !props.hideChart ?
          <BalanceChart
            balance={props.balance}
            address={props.address}
            transactions={props.transactions} />
        : null }
        </div>
      </div>
    ) : null}
    <TransactionOverviewV2
      {...props} />
  </React.Fragment>
);

export default WalletTab;
