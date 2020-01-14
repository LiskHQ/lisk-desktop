import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { withTranslation } from 'react-i18next';
import tableStyles from '../../../toolbox/table/table.css';

const TransactionsHeader = ({
  t, isSmallScreen, columnClassNames,
}) => (
  <div className={`${tableStyles.row} ${tableStyles.header} ${grid.row}`} id="transactionsHeader">
    <div className={`${columnClassNames.transaction} transactions-header`}>
      {t('Transaction')}
    </div>
    <div className={`${columnClassNames.date} transactions-header`}>
      {t('Date')}
    </div>
    <div className={`${columnClassNames.fee} transactions-header`}>
      { isSmallScreen ? t('Fee') : t('Transaction fee') }
    </div>
    <div className={`${columnClassNames.details} transactions-header`}>
      {t('Details')}
    </div>
    <div className={`${columnClassNames.amount} transactions-header`}>
      {t('Amount')}
    </div>
  </div>
);

export default withTranslation()(TransactionsHeader);
