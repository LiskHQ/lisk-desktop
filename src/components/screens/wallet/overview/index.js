import React from 'react';
import { useSelector } from 'react-redux';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import BalanceChart from './balanceChart';
import AccountInfo from './accountInfo';
import BalanceInfo from './balanceInfo';
import { getIndexOfBookmark } from '../../../../utils/bookmarks';
import { isEmpty } from '../../../../utils/helpers';
import styles from './overview.css';

const getProp = (dic, prop, defaultValue) => {
  if (!dic || isEmpty(dic)) {
    return defaultValue;
  }
  return dic[prop];
};

const Overview = ({
  t, activeToken, transactions,
  discreetMode, isWalletRoute, account,
}) => {
  const address = getProp(account, 'address', '');
  const delegate = getProp(account, 'delegate', {});
  const publicKey = getProp(account, 'publicKey', '');
  const hwInfo = getProp(account, 'hwInfo', false);
  const balance = getProp(account, 'balance', 0);
  const bookmarks = useSelector(state => state.bookmarks);
  const isBookmark = getIndexOfBookmark(bookmarks, {
    address, token: activeToken,
  }) !== -1;

  return (
    <section className={`${grid.row} ${styles.wrapper}`}>
      <div className={`${grid['col-xs-4']} ${grid['col-md-4']} ${grid['col-lg-3']}`}>
        <AccountInfo
          t={t}
          hwInfo={hwInfo}
          activeToken={activeToken}
          address={address}
          delegate={delegate}
          isBookmark={isBookmark}
          publicKey={publicKey}
        />
      </div>
      <div className={`${grid['col-xs-4']} ${grid['col-md-4']} ${grid['col-lg-3']}`}>
        <BalanceInfo
          t={t}
          activeToken={activeToken}
          balance={balance}
          isDiscreetMode={discreetMode}
          isWalletRoute={isWalletRoute}
          address={address}
        />
      </div>
      <div className={`${grid['col-xs-4']} ${grid['col-md-4']} ${grid['col-lg-6']}`}>
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
};

export default Overview;
