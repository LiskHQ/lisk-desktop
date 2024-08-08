/* eslint-disable max-statements, complexity */
import React, { useCallback, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import {
  useTokenBalances,
  useLiskLegacyAccount,
  useLiskLegacyHistory,
} from '@token/fungible/hooks/queries';
import TokenCard from '@wallet/components/TokenCard';
import TokenCarousel from '@wallet/components/TokenCarousel/TokenCarousel';
import { selectActiveTokenAccount } from 'src/redux/selectors';
import FlashMessageHolder from '@theme/flashMessage/holder';
import WarnPunishedValidator from '@pos/validator/components/WarnPunishedValidator';
import WalletVisualWithAddress from '@wallet/components/walletVisualWithAddress';
import DialogLink from 'src/theme/dialog/link';
import { useCurrentAccount } from '@account/hooks';
import { useLatestBlock } from '@block/hooks/queries/useLatestBlock';
import { PrimaryButton } from '@theme/buttons';
import { useValidators } from '@pos/validator/hooks/queries';
import { selectSearchParamValue } from 'src/utils/searchParams';
import { useAuth } from '@auth/hooks/queries';
import useSettings from 'src/modules/settings/hooks/useSettings';
import networks from 'src/modules/network/configuration/networks';
import { Client } from 'src/utils/api/client';
import routes from 'src/routes/routes';
import { downloadCSV } from 'src/modules/transaction/utils';
import styles from './overview.css';

// 6: blocks per minute, 60: minutes, 24: hours
const numOfBlockPerDay = 24 * 60 * 6;

const addWarningMessage = ({ isBanned, pomHeight, readMore }) => {
  FlashMessageHolder.addMessage(
    <WarnPunishedValidator isBanned={isBanned} pomHeight={pomHeight} readMore={readMore} />,
    'WarnPunishedValidator'
  );
};

const removeWarningMessage = () => {
  FlashMessageHolder.deleteMessage('WarnPunishedValidator');
};

const Overview = ({ isWalletRoute, history }) => {
  const searchAddress = selectSearchParamValue(history.location.search, 'address');
  const { t } = useTranslation();
  const [{ metadata: { address: currentAddress, name } = {} }] = useCurrentAccount();
  const { mainChainNetwork } = useSettings('mainChainNetwork');
  const isMainnet = mainChainNetwork.serviceUrl === networks.mainnet.serviceUrl;

  const address = useMemo(() => searchAddress || currentAddress, [searchAddress, currentAddress]);
  const { data: validators } = useValidators({ config: { params: { address } } });
  const { data: authData } = useAuth({ config: { params: { address } } });

  const validator = useMemo(() => validators?.data?.[0] || {}, [validators]);
  const {
    data: { height: currentHeight },
  } = useLatestBlock();

  const isBanned = validator.isBanned;
  const pomHeights = validator.punishmentPeriods;

  const daysLeft = Math.ceil((1000 - currentHeight) / numOfBlockPerDay);
  const wallet = useSelector(selectActiveTokenAccount);
  const legacyClient = new Client();
  legacyClient.create({ http: 'https://legacy.lisk.com/' });

  const {
    data: liskLegacyAccount,
    isLoading: isLoadingLegacyAccount,
    error: errorLegacyAccount,
    refetch,
  } = useLiskLegacyAccount({ config: { params: { address } }, client: legacyClient });
  const {
    data: liskLegacyHistory,
    isLoading: isLoadingLegacyHistory,
    error: errorLegacyHistory,
  } = useLiskLegacyHistory({ config: { params: { address } }, client: legacyClient });
  const defaultLegacyBalance = {
    availableBalance: '0',
    lockedBalances: [{ module: 'pos', amount: '0' }],
    symbol: 'LSK',
    logo: {
      svg: 'https://raw.githubusercontent.com/LiskHQ/app-registry/main/testnet/Lisk/images/tokens/lisk.svg',
    },
  };
  const tokenLegacyBalance = liskLegacyAccount
    ? [
        {
          ...liskLegacyAccount.token,
          symbol: 'LSK',
          logo: {
            svg: 'https://raw.githubusercontent.com/LiskHQ/app-registry/main/testnet/Lisk/images/tokens/lisk.svg',
          },
        },
      ]
    : [defaultLegacyBalance];
  const { data: myTokenBalances } = useTokenBalances();
  const hasTokenWithBalance = myTokenBalances?.data?.some(
    (tokenBalance) => BigInt(tokenBalance?.availableBalance || 0) > BigInt(0)
  );

  const host = wallet.summary?.address ?? '';
  const accountName = !!searchAddress && searchAddress !== currentAddress ? validator.name : name;

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
          const url = 'https://lisk.com/blog/posts/lisk-staking-process';
          window.open(url, 'rel="noopener noreferrer"');
        },
      });
    } else {
      removeWarningMessage();
    }
  };

  const renderTokenCard = useCallback(
    (token) => <TokenCard token={token} searchAddress={searchAddress} />,
    []
  );

  useEffect(() => {
    const params = history?.location.search;
    if (params === '') removeWarningMessage();
  }, []);

  useEffect(showWarning, [isWalletRoute, host, address, pomHeights]);

  const downloadAccountHistory = () => {
    downloadCSV(liskLegacyHistory, `${accountName}_account_history`);
  };

  return (
    <section className={`${grid.row} ${styles.wrapper}`}>
      <div
        className={`${grid['col-xs-6']} ${grid['col-md-6']} ${grid['col-lg-6']} ${styles.accountDetailsWrapper}`}
      >
        <DialogLink component="accountDetails" data={{ address }}>
          <WalletVisualWithAddress
            copy
            size={50}
            address={authData?.meta?.address}
            accountName={accountName}
            className={styles.walletVisualWrapper}
            detailsClassName={styles.accountSummary}
            truncate={false}
            isMultisig={authData?.data?.numberOfSignatures > 0}
          />
        </DialogLink>
      </div>
      {isMainnet && !isLoadingLegacyHistory && !errorLegacyHistory && (
        <div
          className={`${grid['col-xs-6']} ${grid['col-md-6']} ${grid['col-lg-6']} ${styles.actionButtons}`}
        >
          <PrimaryButton onClick={downloadAccountHistory}>
            {t('Download account history')}
          </PrimaryButton>
        </div>
      )}
      <div className={styles.tokenCarouselWrapper}>
        <div className={styles.contentWrapper}>
          <div className={`${styles.carouselHeader}`}>
            <div>{t('Tokens')}</div>
            {!searchAddress && hasTokenWithBalance && (
              <div>
                <Link to={`${routes.allTokens.path}`}>{t('View all tokens')}</Link>
              </div>
            )}
          </div>
          <TokenCarousel
            data={tokenLegacyBalance.length ? tokenLegacyBalance : []}
            error={errorLegacyAccount}
            isLoading={isLoadingLegacyAccount}
            renderItem={renderTokenCard}
            onRetry={refetch}
          />
        </div>
      </div>
    </section>
  );
};

export default Overview;
