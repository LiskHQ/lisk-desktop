import React from 'react';
// import grid from 'flexboxgrid/dist/flexboxgrid.css';
import TransactionOverviewV2 from '../transactionsV2/transactionsOverviewV2';
import WalletDetails from './walletDetails';

const WalletTab = ({ ...props }) => (
  <React.Fragment>
    {props.detailAccount ? (
      <WalletDetails
        // Uncomment after adding Graph module
        // className={`${grid['col-md-4']} ${grid['col-lg-3']}`}
        peers={props.peers}
        lastTransaction={props.transaction}
        loadLastTransaction={props.loadLastTransaction}
        balance={props.balance}
        address={props.address}
        wallets={props.wallets}
        />
    ) : null}
    <TransactionOverviewV2
      {...props} />
  </React.Fragment>
);

export default WalletTab;
