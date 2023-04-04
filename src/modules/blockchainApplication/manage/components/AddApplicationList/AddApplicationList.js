import React from 'react';
import { useTranslation } from 'react-i18next';
import Dialog from '@theme/dialog/dialog';
import Box from '@theme/box';
import BoxHeader from '@theme/box/header';
import BoxContent from '@theme/box/content';
import { useBlockchainApplicationExplore } from '@blockchainApplication/explore/hooks/queries/useBlockchainApplicationExplore';
import { QueryTable } from '@theme/QueryTable';
import useMergeApplicationExploreAndMetaData from '../../hooks/useMergeApplicationExploreAndMetaData';
import { useSearchApplications } from '../../hooks/useSearchApplications';
import AddApplicationSearch from '../AddApplicationSearch/AddApplicationSearch';
import AddApplicationRow from '../AddApplicationRow/AddApplicationRow';
import styles from './AddApplicationList.css';

const AddApplicationList = () => {
  const { t } = useTranslation();
  const { ...searchApplicationData } = useSearchApplications();
  const { isUrl, urlStatus, debouncedSearchValue } = searchApplicationData;

  return (
    <Dialog className={styles.dialog} hasClose>
      <Box className={styles.wrapper}>
        <BoxHeader className={`${styles.header} add-application-header`}>
          <div>Add Application</div>
          <AddApplicationSearch {...searchApplicationData} />
        </BoxHeader>
        <BoxContent className={`${styles.content} blockchain-application-add-list`}>
          <QueryTable
            queryHook={useBlockchainApplicationExplore}
            queryConfig={{
              config: {
                params: { search: debouncedSearchValue },
              },
              options: { enabled: (isUrl && urlStatus === 'ok') || !isUrl },
            }}
            transformResponse={(response) => useMergeApplicationExploreAndMetaData(response)}
            row={AddApplicationRow}
            headerClassName={styles.tableHeader}
            header={[]}
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
