import React from 'react';
import BalanceChart from './balanceChart';
import walletDetails from './walletDetails';

const Overview = () => {
  return (
    <section>
      <walletDetails />
      <BalanceChart />
    </section>
  );
};

export default Overview;
