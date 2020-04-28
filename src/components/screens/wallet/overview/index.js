import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import BalanceChart from './balanceChart';
import WalletDetails from './walletDetails';

const Overview = ({
  t, address, balance, activeToken, transactions, discreetMode, hwInfo,
}) => (
  <section className={`${grid.row}`}>
    <div className={`${grid['col-xs-7']} ${grid['col-md-6']} ${grid['col-lg-5']}`}>
      <WalletDetails
        t={t}
        hwInfo={hwInfo}
        activeToken={activeToken}
        address={address}
        balance={balance}
      />
    </div>
    <div className={`${grid['col-xs-5']} ${grid['col-md-6']} ${grid['col-lg-7']}`}>
      <BalanceChart
        t={t}
        transactions={transactions}
        token={activeToken}
        isDiscreetMode={discreetMode}
        balance={balance}
        address={address}
      />
    </div>
  </section>
);

export default Overview;
