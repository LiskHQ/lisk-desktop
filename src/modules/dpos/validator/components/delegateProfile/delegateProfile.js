import React, { useMemo } from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { useTranslation } from 'react-i18next';
import { selectSearchParamValue } from 'src/utils/searchParams';
import { useCurrentAccount } from 'src/modules/account/hooks';
import WalletVisualWithAddress from 'src/modules/wallet/components/walletVisualWithAddress';
import { useBlocks } from 'src/modules/block/hooks/queries/useBlocks';
import DialogLink from 'src/theme/dialog/link';
import Heading from 'src/modules/common/components/Heading';
import { PrimaryButton, SecondaryButton } from 'src/theme/buttons';
import Box from '@theme/box';
import styles from './delegateProfile.css';
import DetailsView from './detailsView';
import PerformanceView from './performanceView';
import DelegateVotesView from './delegateVotesView';
import { useDelegates, useSentVotes } from '../../hooks/queries';

// eslint-disable-next-line max-statements
const DelegateProfile = ({ history }) => {
  const { t } = useTranslation();
  const [{ metadata: { address: currentAddress } = {} }] = useCurrentAccount();
  const address = selectSearchParamValue(history.location.search, 'address') || currentAddress;

  const { data: delegates, isLoading } = useDelegates({
    config: { params: { address } },
  });
  const delegate = useMemo(() => delegates?.data?.[0] || {}, [delegates]);

  const { data: sentVotes, isLoading: sentVotesLoading } = useSentVotes({
    config: { params: { address: currentAddress } },
  });

  const { data: blocks } = useBlocks({
    config: { params: { height: delegate.lastGeneratedHeight } },
  });
  const lastBlockForged = useMemo(() => blocks?.data?.[0] || {}, [blocks]);

  const { data: forgedBlocks } = useBlocks({
    config: { params: { generatorAddress: address } },
  });


  const hasSentVoteToDelegate = useMemo(() => {
    if (!sentVotes?.data) return false;

    return sentVotes.data.votes.some(({ delegateAddress }) => delegateAddress === address);
  }, [sentVotes]);

  if (!delegate.address) history.goBack();

  return (
    <section className={`${styles.container} container`}>
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
            {hasSentVoteToDelegate ? (
              <DialogLink>
                <SecondaryButton disabled={sentVotesLoading}>{t('Edit Vote')}</SecondaryButton>
              </DialogLink>
            ) : (
              <DialogLink>
                <PrimaryButton disabled={sentVotesLoading}>{t('Vote delegate')}</PrimaryButton>
              </DialogLink>
            )}
          </div>
        </div>
      </Heading>
      <Box isLoading={isLoading} className={`${grid.row} ${styles.statsContainer} stats-container`}>
        <DetailsView data={delegate} lastBlockForged={lastBlockForged.timestamp} />
        <PerformanceView data={{ ...delegate, producedBlocks: forgedBlocks?.meta?.total }} />
      </Box>
      <DelegateVotesView address={address} />
    </section>
  );
};

export default DelegateProfile;
