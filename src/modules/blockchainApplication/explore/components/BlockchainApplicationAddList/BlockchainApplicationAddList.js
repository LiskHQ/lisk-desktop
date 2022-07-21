import React from 'react';
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
  liskApplications,
  externalApplications,
  applyFilters,
  filters,
}) => {
  const { t } = useTranslation();
  const dataList = externalApplications.data.length
    ? externalApplications.data
    : liskApplications.data;
  const canLoadMore = liskApplications.meta
    ? liskApplications.data.length < liskApplications.meta.total
    : false;

  const handleLoadMore = () => {
    const params = {
      ...filters,
      offset: liskApplications.meta.count + liskApplications.meta.offset,
    };
    liskApplications.loadData(params);
  };

  return (
    <Dialog hasClose>
      <Box className={styles.wrapper}>
        <BoxHeader className={styles.header}>
          <div>Add Application</div>
          <BlockchainApplicationSearch
            externalApplications={externalApplications}
            applyFilters={applyFilters}
            filters={filters}
          />
        </BoxHeader>
        <BoxContent className={`${styles.content} chain-application-add-list`}>
          <Table
            data={dataList}
            isLoading={liskApplications.isLoading}
            loadingState={BlockchainApplicationSkeleton}
            row={BlockchainApplicationAddRow}
            loadData={handleLoadMore}
            canLoadMore={canLoadMore}
            error={liskApplications.error}
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
