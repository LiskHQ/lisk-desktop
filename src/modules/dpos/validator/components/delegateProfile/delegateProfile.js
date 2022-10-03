import React, { useMemo } from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { useTranslation } from 'react-i18next';
import { selectSearchParamValue } from 'src/utils/searchParams';
import { useCurrentAccount } from 'src/modules/account/hooks';
import { useBlocks } from 'src/modules/block/hooks/queries/useBlocks';
import DialogLink from 'src/theme/dialog/link';
import Heading from 'src/modules/common/components/Heading';
import { PrimaryButton } from 'src/theme/buttons';
import Box from '@theme/box';
import styles from './delegateProfile.css';
import DetailsView from './detailsView';
import PerformanceView from './performanceView';
import DelegateVotesView from './delegateVotesView';
import { useDelegates } from '../../hooks/queries';

const DelegateProfile = ({ history }) => {
  const { t } = useTranslation();
  const [{ metadata: { address: currentAddress } = {} }] = useCurrentAccount();
  const address = selectSearchParamValue(history.location.search, 'address') || currentAddress;

  const { data: delegates, isLoading } = useDelegates({
    config: { params: { address } },
  });

  const delegate = useMemo(() => delegates?.data?.[0] || {}, [delegates]);

  const { data: blocks } = useBlocks({
    config: { params: { height: delegate.lastGeneratedHeight } },
  });

  const { data: forgedBlocks } = useBlocks({
    config: { params: { generatorAddress: address } },
  });

  const lastBlockForged = useMemo(() => blocks?.data?.[0] || {}, [blocks]);

  return (
    <section className={`${styles.container} container`}>
      <Heading className={styles.header} title={t('My delegate profixle')}>
        <div className={styles.rightHeaderSection}>
          <div className={styles.actionButtons}>
            <DialogLink>
              <PrimaryButton>{t('Vote delegate')}</PrimaryButton>
            </DialogLink>
          </div>
        </div>
      </Heading>
      <Box isLoading={isLoading} className={`${grid.row} ${styles.statsContainer} stats-container`}>
        <DetailsView data={delegate} lastBlockForged={lastBlockForged.timestamp} />
        <PerformanceView data={{ ...delegate, producedBlocks: forgedBlocks?.meta?.total }} />
      </Box>
      <DelegateVotesView />
    </section>
  );
};

export default DelegateProfile;
