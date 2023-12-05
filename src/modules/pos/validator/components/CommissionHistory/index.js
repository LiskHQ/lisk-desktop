import React from 'react';
import { useTranslation } from 'react-i18next';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { useCurrentAccount } from '@account/hooks';
import { useTransactionEvents } from '@transaction/hooks/queries';
import Dialog from '@theme/dialog/dialog';
import Box from '@theme/box';
import BoxHeader from '@theme/box/header';
import BoxContent from '@theme/box/content';
import { QueryTable } from '@theme/QueryTable';
import header from './header';
import CommissionHistoryRow from './CommissionHistoryRow';
import styles from './styles.css';

const CommissionHistory = () => {
  const { t } = useTranslation();
  const [currentAccount] = useCurrentAccount();
  return (
    <Dialog hasClose>
      <Box className={`${grid.col} ${styles.historyContainer} history-container`}>
        <BoxHeader className={styles.header}>
          <h1>{t('Commission history')}</h1>
          <h6>{t('Below are the commission history for this validator.')}</h6>
        </BoxHeader>
        <BoxContent className={styles.wrapper}>
          <QueryTable
            showHeader
            queryHook={useTransactionEvents}
            queryConfig={{
              config: {
                params: {
                  senderAddress: currentAccount.metadata.address,
                  name: 'commissionChange',
                },
              },
            }}
            header={header(t)}
            headerClassName={`${grid.row} ${styles.historyDetailsContainer} history-details-container`}
            row={CommissionHistoryRow}
          />
        </BoxContent>
      </Box>
    </Dialog>
  );
};

export default CommissionHistory;
