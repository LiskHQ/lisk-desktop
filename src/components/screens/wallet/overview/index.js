import React from 'react';
// import BalanceChart from './balanceChart';
import WalletDetails from './walletDetails';

const Overview = ({ t, account, activeToken }) => {
  return (
    <section>
      <WalletDetails
        t={t}
        activeToken={activeToken}
        account={account || {}}
      />
      {/* <BalanceChart /> */}
    </section>
  );
};

export default Overview;
