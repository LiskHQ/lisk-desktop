import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import TransactionsOverviewV2 from '../transactionsV2/transactionsOverviewV2';
import BalanceChart from './balanceChart';
import WalletDetails from './walletDetails';

const WalletTab = ({ ...props }) => (
  <React.Fragment>
    {props.detailAccount ? (
      <div className={`${grid.row}`}>
        <div className={`${grid['col-xs-6']} ${grid['col-md-5']} ${grid['col-lg-4']}`}>
          <WalletDetails
            balance={props.balance}
            address={props.address}
            activeToken={props.activeToken}
            />
        </div>
        <div className={`${grid['col-xs-6']} ${grid['col-md-7']} ${grid['col-lg-8']}`}>
        { // istanbul ignore next
          !props.hideChart || props.transactions.length ?
          <BalanceChart
            token={props.activeToken}
            balance={props.balance}
            address={props.address}
            transactions={props.transactions} />
        : null }
        </div>
      </div>
    ) : null}
    <TransactionsOverviewV2
      {...props} />
  </React.Fragment>
);

export default WalletTab;
