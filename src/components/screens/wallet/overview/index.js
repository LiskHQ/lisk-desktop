/* eslint-disable max-statements */
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { compose } from 'redux';
import { withTranslation } from 'react-i18next';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import withData from '@utils/withData';
import { getTransactions } from '@api/transaction';
import { selectTransactions } from '@store/selectors';
import FlashMessageHolder from '@toolbox/flashMessage/holder';
import WarnPunishedDelegate from '@shared/warnPunishedDelegate';
import { withRouter } from 'react-router';
import BalanceChart from './balanceChart';
import AccountInfo from './accountInfo';
import BalanceInfo from './balanceInfo';
import styles from './overview.css';

const addWarningMessage = ({ isBanned, pomHeight, readMore }) => {
  FlashMessageHolder.addMessage(
    <WarnPunishedDelegate
      isBanned={isBanned}
      pomHeight={pomHeight}
      readMore={readMore}
    />,
    'WarnPunishedDelegate',
  );
};

const removeWarningMessage = () => {
  FlashMessageHolder.deleteMessage('WarnPunishedDelegate');
};

const Overview = ({
  t,
  activeToken,
  transactions,
  hwInfo,
  discreetMode,
  isWalletRoute,
  account,
  history,
}) => {
  const {
    address,
    publicKey,
    balance = 0,
    isMultisignature,
  } = account?.summary ?? {};
  const isBanned = account?.dpos?.delegate?.isBanned;
  const pomHeights = account?.dpos?.delegate?.pomHeights;

  const { confirmed } = useSelector(selectTransactions);
  const bookmark = useSelector((state) =>
    state.bookmarks[activeToken].find((item) => item.address === address));
  const host = useSelector(
    (state) =>
      (state.account
        && state.account.info
        && state.account.info[activeToken]
        && state.account.info[activeToken].summary?.address)
      || '',
  );

  const showWarning = () => {
    if (!isWalletRoute && host && address && (isBanned || pomHeights?.length)) {
      addWarningMessage({
        isBanned,
        pomHeight: pomHeights ? pomHeights[pomHeights.length - 1] : 0,
        readMore: () => {
          const url = 'https://lisk.com/blog/development/lisk-voting-process';
          window.open(url, 'rel="noopener noreferrer"');
        },
      });
    } else {
      removeWarningMessage();
    }
  };

  useEffect(() => {
    const params = history?.location.search;
    if (params === '') {
      removeWarningMessage();
    }
  }, []);

  useEffect(() => {
    if (!isWalletRoute && address) {
      transactions.loadData({ address });
    }
  }, [address]);

  return (
    <section className={`${grid.row} ${styles.wrapper}`}>
      {
        showWarning()
      }
      <div
        className={`${grid['col-xs-6']} ${grid['col-md-3']} ${grid['col-lg-3']}`}
      >
        <AccountInfo
          t={t}
          hwInfo={hwInfo}
          activeToken={activeToken}
          address={address}
          username={account?.dpos?.delegate?.username}
          bookmark={bookmark}
          publicKey={publicKey}
          host={host}
          account={account}
          isMultisignature={isMultisignature}
        />
      </div>
      <div
        className={`${grid['col-xs-6']} ${grid['col-md-3']} ${grid['col-lg-3']}`}
      >
        <BalanceInfo
          t={t}
          activeToken={activeToken}
          balance={balance}
          isDiscreetMode={discreetMode}
          isWalletRoute={isWalletRoute}
          username={account?.dpos?.delegate?.username}
          address={address}
          isBanned={isBanned}
          pomStart={pomHeights?.length
            ? { ...pomHeights[pomHeights.length - 1] }
            : {}}
        />
      </div>
      <div
        className={`${grid['col-xs-12']} ${grid['col-md-6']} ${grid['col-lg-6']} ${styles.balanceChart}`}
      >
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
  withRouter,
  withData({
    transactions: {
      apiUtil: (network, { token, ...params }) =>
        getTransactions({ network, params }, token),
      getApiParams: (state) => ({
        token: state.settings.token.active,
      }),
      defaultData: { data: [], meta: {} },
      autoload: false,
    },
  }),
  withTranslation(),
)(Overview);
