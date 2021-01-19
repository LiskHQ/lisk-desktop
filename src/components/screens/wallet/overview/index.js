import React from 'react';
import { useSelector } from 'react-redux';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import BalanceChart from './balanceChart';
import AccountInfo from './accountInfo';
import BalanceInfo from './balanceInfo';
import { isEmpty } from '../../../../utils/helpers';
import styles from './overview.css';

const getProp = (dic, prop, defaultValue) => {
  if (!dic || isEmpty(dic)) {
    return defaultValue;
  }
  return dic[prop];
};

const Overview = ({
  t, activeToken, transactions, hwInfo,
  discreetMode, isWalletRoute, account,
}) => {
  const address = getProp(account, 'address', '');
  const publicKey = getProp(account, 'publicKey', '');
  const balance = getProp(account, 'balance', 0);
  const bookmark = useSelector(
    state => state.bookmarks[activeToken].find(item => (item.address === address)),
  );
  const host = useSelector(
    state => (state.account
      && state.account.info
      && state.account.info[activeToken]
      && state.account.info[activeToken].address) || '',
  );

  return (
    <section className={`${grid.row} ${styles.wrapper}`}>
      <div className={`${grid['col-xs-6']} ${grid['col-md-3']} ${grid['col-lg-3']}`}>
        <AccountInfo
          t={t}
          hwInfo={hwInfo}
          activeToken={activeToken}
          address={address}
          account={account}
          isDelegate={!!account.delegate}
          bookmark={bookmark}
          publicKey={publicKey}
          host={host}
        />
      </div>
      <div className={`${grid['col-xs-6']} ${grid['col-md-3']} ${grid['col-lg-3']}`}>
        <BalanceInfo
          t={t}
          activeToken={activeToken}
          balance={balance}
          isDiscreetMode={discreetMode}
          isWalletRoute={isWalletRoute}
          isDelegate={!!account.delegate}
          address={address}
        />
      </div>
      <div className={`${grid['col-xs-12']} ${grid['col-md-6']} ${grid['col-lg-6']} ${styles.balanceChart}`}>
        <BalanceChart
          t={t}
          transactions={transactions}
          token={activeToken}
          isDiscreetMode={discreetMode && host === address}
          balance={balance}
          address={address}
        />
      </div>
    </section>
  );
};

export default Overview;
