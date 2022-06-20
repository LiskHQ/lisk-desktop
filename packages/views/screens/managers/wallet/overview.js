/* eslint-disable max-statements */
import React, { useEffect } from 'react';
import { useSelector, connect } from 'react-redux';
import { withRouter } from 'react-router';
import { compose } from 'redux';
import { withTranslation } from 'react-i18next';
import grid from 'flexboxgrid/dist/flexboxgrid.css';

import withData from 'src/utils/withData';
import { getTransactions } from '@transaction/api';
import { selectActiveTokenAccount } from 'src/redux/selectors';
import FlashMessageHolder from 'src/theme/flashMessage/holder';
import WarnPunishedDelegate from '@dpos/validator/components/WarnPunishedDelegate';
import WalletInfo from '@wallet/components/walletInfo';
import BalanceInfo from '@token/fungible/components/BalanceInfo';
import styles from './overview.css';

const mapStateToProps = (state) => ({
  currentHeight: state.blocks.latestBlocks.length
    ? state.blocks.latestBlocks[0].height
    : 0,
});

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
  currentHeight,
}) => {
  const { address, publicKey, isMultisignature } = account?.summary ?? {};

  const isBanned = account?.dpos?.delegate?.isBanned;
  const pomHeights = account?.dpos?.delegate?.pomHeights;
  const { end } = pomHeights ? pomHeights[pomHeights.length - 1] : 0;
  // 6: blocks per minute, 60: minutes, 24: hours
  const numOfBlockPerDay = 24 * 60 * 6;
  const daysLeft = Math.ceil((end - currentHeight) / numOfBlockPerDay);

  const bookmark = useSelector((state) =>
    state.bookmarks[activeToken].find((item) => item.address === address));
  const wallet = useSelector(selectActiveTokenAccount);
  const host = wallet.summary?.address ?? '';

  const showWarning = () => {
    if (
      !isWalletRoute
      && host
      && address
      && (isBanned || pomHeights?.length)
      && (isBanned || daysLeft >= 1)
    ) {
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

  useEffect(showWarning, [isWalletRoute, host, address, pomHeights]);

  return (
    <section className={`${grid.row} ${styles.wrapper}`}>
      <div
        className={`${grid['col-xs-6']} ${grid['col-md-3']} ${grid['col-lg-3']}`}
      >
        <WalletInfo
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
          isDiscreetMode={discreetMode}
          isWalletRoute={isWalletRoute}
          account={account}
          address={address}
        />
      </div>
    </section>
  );
};

export default compose(
  withRouter,
  connect(mapStateToProps),
  withData({
    transactions: {
      apiUtil: (network, { token, ...params }) =>
        getTransactions({ network, params }),
      defaultData: { data: [], meta: {} },
      autoload: false,
    },
  }),
  withTranslation(),
)(Overview);
