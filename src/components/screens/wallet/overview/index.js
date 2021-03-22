import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { compose } from 'redux';
import { withTranslation } from 'react-i18next';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import withData from '@utils/withData';
import { getTransactions } from '@utils/api/transaction';
import BalanceChart from './balanceChart';
import AccountInfo from './accountInfo';
import BalanceInfo from './balanceInfo';
import styles from './overview.css';

const Overview = ({
  t, activeToken, transactions, hwInfo,
  discreetMode, isWalletRoute, account,
}) => {
  const { address, publicKey, balance } = account.info.LSK.summary;
  const { confirmed } = useSelector(state => state.transactions);
  const bookmark = useSelector(
    state => state.bookmarks[activeToken].find(item => (item.address === address)),
  );

  const host = useSelector(
    state => (state.account
      && state.account.info
      && state.account.info[activeToken]
      && state.account.info[activeToken].address) || '',
  );

  useEffect(() => {
    if (!isWalletRoute && address) {
      transactions.loadData({ address });
    }
  }, [address]);

  return (
    <section className={`${grid.row} ${styles.wrapper}`}>
      <div className={`${grid['col-xs-6']} ${grid['col-md-3']} ${grid['col-lg-3']}`}>
        <AccountInfo
          t={t}
          hwInfo={hwInfo}
          activeToken={activeToken}
          address={address}
          account={account}
          username={account.delegate && account.delegate.username}
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
          username={account.delegate && account.delegate.username}
          address={address}
        />
      </div>
      <div className={`${grid['col-xs-12']} ${grid['col-md-6']} ${grid['col-lg-6']} ${styles.balanceChart}`}>
        {address && (
          <BalanceChart
            t={t}
            transactions={isWalletRoute ? confirmed : transactions.data.data}
            token={activeToken}
            isDiscreetMode={discreetMode && host === address}
            balance={balance}
            address={address}
          />
        )}
      </div>
    </section>
  );
};

export default compose(
  withData({
    transactions: {
      apiUtil: (network, { token, ...params }) => getTransactions({ network, params }, token),
      getApiParams: state => ({
        token: state.settings.token.active,
      }),
      defaultData: { data: [], meta: {} },
      autoload: false,
    },
  }),
  withTranslation(),
)(Overview);
