import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { translate } from 'react-i18next';
import TableRow from '../toolbox/table/tableRow';

const TransactionsHeaderV2 = ({
  t, isSmallScreen, columnClassNames,
}) => (
  <TableRow isHeader className={`${grid.row}`} id="transactionsHeader">
    <div className={`${columnClassNames.transaction} transactions-header`}>
      {t('Transaction')}
    </div>
    <div className={`${columnClassNames.date} transactions-header`}>
      {t('Date')}
    </div>
    <div className={`${columnClassNames.fee} transactions-header`}>
      { isSmallScreen ? t('Fee') : t('Transaction Fee') }
    </div>
    <div className={`${columnClassNames.details} transactions-header`}>
      {t('Details')}
    </div>
    <div className={`${columnClassNames.amount} transactions-header`}>
      {t('Amount')}
    </div>
  </TableRow>
);

export default translate()(TransactionsHeaderV2);
