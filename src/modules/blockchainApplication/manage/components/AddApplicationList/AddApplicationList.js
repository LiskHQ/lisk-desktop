import React from 'react';
import { useTranslation } from 'react-i18next';
import Dialog from '@theme/dialog/dialog';
import Box from '@theme/box';
import BoxHeader from '@theme/box/header';
import BoxContent from '@theme/box/content';
import Table from '@theme/table';
import { useSearchApplications } from '../../hooks/useSearchApplications';
import AddApplicationSearch from '../AddApplicationSearch/AddApplicationSearch';
import AddApplicationRow from '../AddApplicationRow/AddApplicationRow';
import BlockchainApplicationSkeleton from '../../../explore/components/BlockchainApplicationSkeleton';
import styles from './AddApplicationList.css';

const AddApplicationList = ({ liskApplications, externalApplications, filters }) => {
  const { t } = useTranslation();
  const { data, ...searchResponse } = useSearchApplications();
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
    <Dialog className={styles.dialog} hasClose>
      <Box className={styles.wrapper}>
        <BoxHeader className={`${styles.header} add-application-header`}>
          <div>Add Application</div>
          <AddApplicationSearch {...searchResponse} />
        </BoxHeader>
        <BoxContent className={`${styles.content} blockchain-application-add-list`}>
          <Table
            data={dataList}
            isLoading={liskApplications.isLoading}
            loadingState={BlockchainApplicationSkeleton}
            row={AddApplicationRow}
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

export default AddApplicationList;
