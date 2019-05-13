import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import TransactionsOverviewV2 from '../transactionsV2/transactionsOverviewV2';
import BalanceChart from './balanceChart';
import WalletDetails from './walletDetails';

const WalletTab = ({ ...props }) => (
  <React.Fragment>
    {props.detailAccount && props.activeToken !== 'BTC' ? (
      <div className={`${grid.row}`}>
        <div className={`${grid['col-sm-4']} ${grid['col-lg-3']}`}>
          <WalletDetails
            peers={props.peers}
            lastTransaction={props.transaction}
            loadLastTransaction={props.loadLastTransaction}
            balance={props.balance}
            address={props.address}
            wallets={props.wallets}
            activeToken={props.activeToken}
            />
        </div>
        <div className={`${grid['col-sm-8']} ${grid['col-lg-9']}`}>
        { // istanbul ignore next
          !props.hideChart || props.transactions.length ?
          <BalanceChart
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
