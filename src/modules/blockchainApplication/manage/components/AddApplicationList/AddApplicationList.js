import React from 'react';
import { useTranslation } from 'react-i18next';
import Dialog from '@theme/dialog/dialog';
import Box from '@theme/box';
import BoxHeader from '@theme/box/header';
import BoxContent from '@theme/box/content';
import Table from '@theme/table';
import useApplicationsQuery from 'src/modules/blockchainApplication/explore/hooks/queries/useApplicationsQuery';
import { useSearchApplications } from '../../hooks/useSearchApplications';
import AddApplicationSearch from '../AddApplicationSearch/AddApplicationSearch';
import AddApplicationRow from '../AddApplicationRow/AddApplicationRow';
import BlockchainApplicationSkeleton from '../../../explore/components/BlockchainApplicationSkeleton';
import styles from './AddApplicationList.css';

const AddApplicationList = ({
  filters,
}) => {
  const { t } = useTranslation();
  const {
    data,
    ...searchResponse
  } = useSearchApplications();
  const { data: applications = {}, isLoading, error, fetchNextPage } = useApplicationsQuery()

  const dataList = applications.data ?? []
  const canLoadMore = applications.meta
    ? applications.data?.length < applications.meta.total
    : false;

  const handleLoadMore = () => {
    const params = {
      ...filters,
      offset: applications.meta?.count + applications.meta.offset,
    };
    fetchNextPage(params)
  };

  return (
    <Dialog className={styles.dialog} hasClose>
      <Box className={styles.wrapper}>
        <BoxHeader className={`${styles.header} add-application-header`}>
          <div>Add Application</div>
          <AddApplicationSearch
            {...searchResponse}
          />
        </BoxHeader>
        <BoxContent className={`${styles.content} blockchain-application-add-list`}>
          <Table
            data={dataList}
            isLoading={isLoading}
            loadingState={BlockchainApplicationSkeleton}
            row={AddApplicationRow}
            loadData={handleLoadMore}
            canLoadMore={canLoadMore}
            error={error}
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
