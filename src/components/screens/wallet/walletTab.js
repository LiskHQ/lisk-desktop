import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import TransactionsOverview from './transactions/transactionsOverview';
import BalanceChart from './balanceChart';
import WalletDetails from './walletDetails';

const WalletTab = ({ ...props }) => (
  <React.Fragment>
    <div className={`${grid.row}`}>
      <div className={`${grid['col-xs-7']} ${grid['col-md-6']} ${grid['col-lg-5']}`}>
        <WalletDetails
          balance={props.balance}
          address={props.address}
          activeToken={props.activeToken}
          account={props.account}
        />
      </div>
      <div className={`${grid['col-xs-5']} ${grid['col-md-6']} ${grid['col-lg-7']}`}>
        { // istanbul ignore next
          !props.hideChart || props.transactions.length
            ? (
              <BalanceChart
                isDiscreetMode={props.account.address === props.address && props.isDiscreetMode}
                token={props.activeToken}
                balance={props.balance}
                address={props.address}
                transactions={props.transactions}
              />
            )
            : null }
      </div>
    </div>
    <TransactionsOverview
      {...props}
    />
  </React.Fragment>
);

export default WalletTab;
