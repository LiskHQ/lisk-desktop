/* eslint-disable max-statements */
import React, { useCallback, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { useTokensBalance } from 'src/modules/token/fungible/hooks/queries';
import TokenCard from 'src/modules/wallet/components/TokenCard';
import TokenCarousel from 'src/modules/wallet/components/TokenCarousel/TokenCarousel';
import { selectActiveTokenAccount } from 'src/redux/selectors';
import FlashMessageHolder from '@theme/flashMessage/holder';
import WarnPunishedDelegate from '@dpos/validator/components/WarnPunishedDelegate';
import WalletVisualWithAddress from '@wallet/components/walletVisualWithAddress';
import DialogLink from 'src/theme/dialog/link';
import { useCurrentAccount } from '@account/hooks';
import { useBlocks } from '@block/hooks/queries/useBlocks';
import { SecondaryButton, PrimaryButton } from '@theme/buttons';
import { useDelegates } from '@dpos/validator/hooks/queries';
import { selectSearchParamValue } from 'src/utils/searchParams';
import { useAuth } from '@auth/hooks/queries';
import styles from './overview.css';
import chainLogo from '../../../../../setup/react/assets/images/LISK.png';

// @Todo: this should be remove as sdk would provide this data
// 6: blocks per minute, 60: minutes, 24: hours
const numOfBlockPerDay = 24 * 60 * 6;

const addWarningMessage = ({ isBanned, pomHeight, readMore }) => {
  FlashMessageHolder.addMessage(
    <WarnPunishedDelegate isBanned={isBanned} pomHeight={pomHeight} readMore={readMore} />,
    'WarnPunishedDelegate'
  );
};

const removeWarningMessage = () => {
  FlashMessageHolder.deleteMessage('WarnPunishedDelegate');
};

const Overview = ({ isWalletRoute, history }) => {
  const searchAddress = selectSearchParamValue(history.location.search, 'address');
  const { t } = useTranslation();
  const [{ metadata: { address: currentAddress } = {} }] = useCurrentAccount();

  const address = useMemo(() => searchAddress || currentAddress, [searchAddress, currentAddress]);
  const { data: delegates } = useDelegates({ config: { params: { address } } });
  const { data: account } = useAuth({ config: { params: { address } } });
  const { data: blocks } = useBlocks();

  const delegate = useMemo(() => delegates?.data?.[0] || {}, [delegates]);
  const currentHeight = useMemo(() => blocks?.data?.[0]?.height, [blocks]);

  const isBanned = delegate.isBanned;
  const pomHeights = delegate.pomHeights;
  // const { end } = pomHeights?.length ? pomHeights[pomHeights.length - 1] : {};

  const daysLeft = Math.ceil((1000 - currentHeight) / numOfBlockPerDay);
  const wallet = useSelector(selectActiveTokenAccount);
  const { data: tokens, isLoading, error } = useTokensBalance({ config: { params: { address } } });
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

  const renderTokenCard = useCallback(
    ({ chainUrl = chainLogo, symbol, availableBalance, lockedBalances }) => {
      const totalLockedBalance = useMemo(
        () => lockedBalances?.reduce((total, { amount }) => +amount + total, 0) ?? 0,
        [lockedBalances]
      );

      return (
        <TokenCard
          availableBalance={availableBalance}
          lockedBalance={totalLockedBalance}
          address={address}
          symbol={symbol || ''}
          url={chainUrl}
        />
      );
    },
    [address]
  );

  useEffect(() => {
    const params = history?.location.search;
    if (params === '') removeWarningMessage();
  }, []);

  useEffect(showWarning, [isWalletRoute, host, address, pomHeights]);

  return (
    <section className={`${grid.row} ${styles.wrapper}`}>
      <div className={`${grid['col-xs-6']} ${grid['col-md-6']} ${grid['col-lg-6']}`}>
        <WalletVisualWithAddress
          copy
          size={50}
          address={account?.meta?.address}
          accountName={account?.meta?.name}
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
            <div>{t('Tokens')}</div>
            <div>
              <Link to="/wallet/tokens/all">{t('View all tokens')}</Link>
            </div>
          </div>
          <TokenCarousel
            data={tokens?.data ?? []}
            error={error}
            isLoading={isLoading}
            renderItem={renderTokenCard}
          />
        </div>
      </div>
    </section>
  );
};

export default Overview;
