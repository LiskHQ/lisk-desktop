import React, { useEffect, useMemo } from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { useTranslation } from 'react-i18next';
import { selectSearchParamValue } from 'src/utils/searchParams';
import { useCurrentAccount } from 'src/modules/account/hooks';
import WalletVisualWithAddress from 'src/modules/wallet/components/walletVisualWithAddress';
import { useBlocks } from 'src/modules/block/hooks/queries/useBlocks';
import Heading from 'src/modules/common/components/Heading';
import { toast } from 'react-toastify';
import FlashMessageHolder from 'src/theme/flashMessage/holder';
import Box from '@theme/box';
import styles from './delegateProfile.css';
import DetailsView from './detailsView';
import PerformanceView from './performanceView';
import DelegateVotesView from './delegateVotesView';
import { useDelegates } from '../../hooks/queries';
import DelegateVoteButton from './delegateVoteButton';
import WarnPunishedDelegate from '../WarnPunishedDelegate';

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

// eslint-disable-next-line max-statements
const DelegateProfile = ({ history }) => {
  const { t } = useTranslation();
  const [{ metadata: { address: currentAddress } = {} }] = useCurrentAccount();
  const address = selectSearchParamValue(history.location.search, 'address') || currentAddress;

  const { data: delegates, isLoading: isLoadingDelegates } = useDelegates({
    config: { params: { address } },
  });
  const delegate = useMemo(() => delegates?.data?.[0] || {}, [delegates]);

  const { data: forgedBlocks } = useBlocks({
    config: { params: { generatorAddress: address } },
  });

  const { data: blocks } = useBlocks({ config: { params: { limit: 1 } } });
  const currentHeight = useMemo(() => blocks?.data?.[0]?.height, [blocks]);
  const isBanned = delegate.isBanned;

  useEffect(() => {
    const pomHeights = delegate.pomHeights;
    const { end } = pomHeights ? pomHeights[pomHeights.length - 1] : 0;
    const daysLeft = Math.ceil((end - currentHeight) / numOfBlockPerDay);

    if (
      delegate &&
      address !== currentAddress && // this ensures we are checking against a delegate account that is not the current user
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
  }, [address, delegate, blocks]);

  if (!delegate.address && !isLoadingDelegates) {
    toast.info("This user isn't a delegate");
    history.goBack();
  }

  return (
    <section className={`${styles.container} container`}>
      <FlashMessageHolder />
      <Heading
        className={styles.header}
        title={
          address === currentAddress ? (
            t('My delegate profile')
          ) : (
            <WalletVisualWithAddress
              copy
              size={50}
              address={address}
              accountName={delegate.name}
              detailsClassName={styles.accountSummary}
              truncate={false}
            />
          )
        }
      >
        <div className={styles.rightHeaderSection}>
          <div className={styles.actionButtons}>
            <DelegateVoteButton
              currentAddress={currentAddress}
              address={address}
              isBanned={isBanned}
            />
          </div>
        </div>
      </Heading>
      <Box
        isLoading={isLoadingDelegates}
        className={`${grid.row} ${styles.statsContainer} stats-container`}
      >
        <DetailsView data={delegate} />
        <PerformanceView data={{ ...delegate, producedBlocks: forgedBlocks?.meta?.total }} />
      </Box>
      <DelegateVotesView address={address} />
    </section>
  );
};

export default DelegateProfile;
