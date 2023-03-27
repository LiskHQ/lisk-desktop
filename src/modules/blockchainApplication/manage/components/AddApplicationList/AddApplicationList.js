import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Dialog from '@theme/dialog/dialog';
import Box from '@theme/box';
import BoxHeader from '@theme/box/header';
import BoxContent from '@theme/box/content';
import { useBlockchainApplicationExplore } from '@blockchainApplication/explore/hooks/queries/useBlockchainApplicationExplore';
import { QueryTable } from 'src/theme/QueryTable';
import { useSearchApplications } from '../../hooks/useSearchApplications';
import AddApplicationSearch from '../AddApplicationSearch/AddApplicationSearch';
import AddApplicationRow from '../AddApplicationRow/AddApplicationRow';
import styles from './AddApplicationList.css';

const AddApplicationList = () => {
  const { t } = useTranslation();
  const [searchParam, setSearchParam] = useState('');
  const { data, ...searchResponse } = useSearchApplications(setSearchParam);
  const { isURL, URLStatus } = searchResponse;

  return (
    <Dialog className={styles.dialog} hasClose>
      <Box className={styles.wrapper}>
        <BoxHeader className={`${styles.header} add-application-header`}>
          <div>Add Application</div>
          <AddApplicationSearch {...searchResponse} />
        </BoxHeader>
        <BoxContent className={`${styles.content} blockchain-application-add-list`}>
          <QueryTable
            queryHook={useBlockchainApplicationExplore}
            queryConfig={{
              config: { params: { search: searchParam } },
              options: { enabled: (isURL && URLStatus === 'ok') || !isURL },
            }}
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
