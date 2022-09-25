/* eslint-disable max-statements */
import React, { useEffect } from 'react';
import { useSelector, connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { compose } from 'redux';
import { withTranslation } from 'react-i18next';
import grid from 'flexboxgrid/dist/flexboxgrid.css';

import TokenCard from 'src/modules/wallet/components/TokenCard';
import TokenCarousel from 'src/modules/wallet/components/TokenCarousel/TokenCarousel';
import withData from 'src/utils/withData';
import { getTransactions } from '@transaction/api';
import { selectActiveTokenAccount } from 'src/redux/selectors';
import FlashMessageHolder from '@theme/flashMessage/holder';
import WarnPunishedDelegate from '@dpos/validator/components/WarnPunishedDelegate';
import WalletVisualWithAddress from '@wallet/components/walletVisualWithAddress';
import DialogLink from 'src/theme/dialog/link';
import { SecondaryButton, PrimaryButton } from '@theme/buttons';
import styles from './overview.css';
import chainLogo from '../../../../../setup/react/assets/images/LISK.png';

const mapStateToProps = (state) => ({
  currentHeight: state.blocks.latestBlocks.length ? state.blocks.latestBlocks[0].height : 0,
});

const addWarningMessage = ({ isBanned, pomHeight, readMore }) => {
  FlashMessageHolder.addMessage(
    <WarnPunishedDelegate isBanned={isBanned} pomHeight={pomHeight} readMore={readMore} />,
    'WarnPunishedDelegate'
  );
};

const removeWarningMessage = () => {
  FlashMessageHolder.deleteMessage('WarnPunishedDelegate');
};

const Overview = ({ t, transactions, isWalletRoute, account, history, currentHeight }) => {
  const { address } = account?.summary ?? {};

  const isBanned = account?.dpos?.delegate?.isBanned;
  const pomHeights = account?.dpos?.delegate?.pomHeights;
  const { end } = pomHeights ? pomHeights[pomHeights.length - 1] : 0;
  // 6: blocks per minute, 60: minutes, 24: hours
  const numOfBlockPerDay = 24 * 60 * 6;
  const daysLeft = Math.ceil((end - currentHeight) / numOfBlockPerDay);
  const wallet = useSelector(selectActiveTokenAccount);
  const host = wallet.summary?.address ?? '';

  const showWarning = () => {
    if (
      !isWalletRoute &&
      host &&
      address &&
      (isBanned || pomHeights?.length) &&
      (isBanned || daysLeft >= 1)
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
      <div className={`${grid['col-xs-6']} ${grid['col-md-6']} ${grid['col-lg-6']}`}>
        <WalletVisualWithAddress
          copy
          address={address}
          accountName={account?.dpos?.delegate?.username || 'Lisker'}
          detailsClassName={styles.accountSummary}
          truncate={false}
        />
      </div>
      <div className={`${grid['col-xs-6']} ${grid['col-md-6']} ${grid['col-lg-6']}`}>
        <div className={`${grid.row} ${styles.actionButtons}`}>
          <div className={`${grid['col-xs-3']} ${grid['col-md-3']} ${grid['col-lg-3']}`}>
            <DialogLink component="request">
              <SecondaryButton>{t('Request')}</SecondaryButton>
            </DialogLink>
          </div>
          <div className={`${grid['col-xs-3']} ${grid['col-md-3']} ${grid['col-lg-3']}`}>
            <DialogLink component="send">
              <PrimaryButton>{t('Send')}</PrimaryButton>
            </DialogLink>
          </div>
        </div>
      </div>
      <div main className={styles.tokenCarouselWrapper}>
        <div className={styles.contentWrapper}>
          <div className={`${styles.carouselHeader}`}>
            <div>Tokens</div>
            <div>
              <Link to="/wallet/tokens/all">View all tokens</Link>
            </div>
          </div>
          <TokenCarousel
            data={[...new Array(16).keys()]}
            renderItem={() => (
              <TokenCard
                balance={30000000000000}
                lockedBalance={3000000000}
                symbol="LSK"
                url={chainLogo}
              />
            )}
          />
        </div>
      </div>
    </section>
  );
};

export default compose(
  withRouter,
  connect(mapStateToProps),
  withData({
    transactions: {
      apiUtil: (network, { token, ...params }) => getTransactions({ network, params }),
      defaultData: { data: [], meta: {} },
      autoload: false,
    },
  }),
  withTranslation()
)(Overview);
