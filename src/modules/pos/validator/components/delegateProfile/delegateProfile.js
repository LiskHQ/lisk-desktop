import React, { useEffect, useMemo } from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { useTranslation } from 'react-i18next';
import { selectSearchParamValue } from 'src/utils/searchParams';
import { useCurrentAccount } from '@account/hooks';
import WalletVisualWithAddress from '@wallet/components/walletVisualWithAddress';
import { useBlocks } from '@block/hooks/queries/useBlocks';
import { useLatestBlock } from '@block/hooks/queries/useLatestBlock';
import Heading from 'src/modules/common/components/Heading';
import { toast } from 'react-toastify';
import FlashMessageHolder from 'src/theme/flashMessage/holder';
import Box from '@theme/box';
import styles from './delegateProfile.css';
import DetailsView from './detailsView';
import PerformanceView from './performanceView';
import DelegateVotesView from './delegateVotesView';
import { useValidators } from '../../hooks/queries';
import DelegateVoteButton from './delegateVoteButton';
import WarnPunishedValidator from '../WarnPunishedValidator';

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

// eslint-disable-next-line max-statements
const DelegateProfile = ({ history }) => {
  const { t } = useTranslation();
  const [{ metadata: { address: currentAddress } = {} }] = useCurrentAccount();
  const address = selectSearchParamValue(history.location.search, 'address') || currentAddress;

  const { data: delegates, isLoading: isLoadingDelegates } = useValidators({
    config: { params: { address } },
  });
  const delegate = useMemo(() => delegates?.data?.[0] || {}, [delegates]);

  const { data: forgedBlocks } = useBlocks({
    config: { params: { generatorAddress: address } },
  });

  const {
    data: { height: currentHeight },
  } = useLatestBlock();
  const isBanned = delegate.isBanned;

  useEffect(() => {
    const pomHeights = delegate.pomHeights;
    const { end } = pomHeights?.length ? pomHeights[pomHeights.length - 1] : 0;
    const daysLeft = Math.ceil((end - currentHeight) / numOfBlockPerDay);

    if (
      delegate.address &&
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
  }, [address, delegate, currentHeight]);

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
