import React from 'react';
import Table from '../../../toolbox/table';
import Box from '../../../toolbox/box';
import BoxHeader from '../../../toolbox/box/header';
import BoxContent from '../../../toolbox/box/content';
import FilterDropdownButton from '../../../shared/filterDropdownButton';
import TransactionRow from './transactionRow';
import header from './transactionsTableHeader';
import styles from './multiSignature.css';

const TransactionsTable = ({ transactions, t, host }) => (
  <Box>
    <BoxHeader>
      <h2>{t('Pending multisignature transactions')}</h2>
      <FilterDropdownButton
        t={t}
        filters={{ amountTo: '' }}
        applyFilters={() => {}}
        fields={[{
          label: t('Amount Range'),
          name: 'amount',
          type: 'number-range',
        }]}
      />
    </BoxHeader>
    <BoxContent className={`${styles.content} transactions-table`}>
      <Table
        data={transactions}
        row={TransactionRow}
        header={header(t)}
        additionalRowProps={{ t, host }}
      />
    </BoxContent>
  </Box>
);

export default TransactionsTable;
