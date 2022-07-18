import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Dialog from '@theme/dialog/dialog';
import Box from '@theme/box';
import BoxHeader from '@theme/box/header';
import BoxContent from '@theme/box/content';
import Table from '@theme/table';
import BlockchainApplicationSearch from '../BlockchainApplicationSearch/BlockchainApplicationSearch';
import BlockchainApplicationAddRow from '../BlockchainApplicationAddRow/BlockchainApplicationAddRow';
import BlockchainApplicationSkeleton from '../BlockchainApplicationSkeleton';
import styles from './BlockchainApplicationAddList.css';

const BlockchainApplicationAddList = ({
  applications,
  filters,
}) => {
  const { t } = useTranslation();
  const canLoadMore = useMemo(() =>
    (applications.meta
      ? applications.data.length < applications.meta.total : false), [applications]);

  const handleLoadMore = () => {
    const params = {
      ...filters,
      offset: applications.meta.count + applications.meta.offset,
    };
    applications.loadData(params);
  };

  return (
    <Dialog hasClose>
      <Box className={styles.wrapper}>
        <BoxHeader className={styles.header}>
          <div>Add Application</div>
          <BlockchainApplicationSearch />
        </BoxHeader>
        <BoxContent className={`${styles.content} chain-application-add-list`}>
          <Table
            data={applications.data}
            isLoading={applications.isLoading}
            loadingState={BlockchainApplicationSkeleton}
            row={BlockchainApplicationAddRow}
            loadData={handleLoadMore}
            canLoadMore={canLoadMore}
            error={applications.error}
            additionalRowProps={{ t }}
            emptyState={{
              message: t('There are no blockchain applications.'),
            }}
          />
        </BoxContent>
      </Box>
    </Dialog>
  );
};

export default BlockchainApplicationAddList;
