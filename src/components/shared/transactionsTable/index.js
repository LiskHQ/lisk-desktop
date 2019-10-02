import React from 'react';
import { Link } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import Box from '../../toolbox/box';
import TableRow from '../../toolbox/table/tableRow';
import LiskAmount from '../liskAmount';
import { DateTimeFromTimestamp } from '../../toolbox/timestamp';
import Icon from '../../toolbox/icon';

const TransactionsTable = ({
  t, title, columns, transactions,
}) => {
  const renderCellContent = (column, transaction) => {
    switch (column.key) {
      case 'id':
        return (
          <Link to={`${column.pathPrefix}/${transaction[column.key]}`}>
            {transaction[column.key]}
          </Link>
        );
      case 'amount':
      case 'fee':
        return (
          <React.Fragment>
            <LiskAmount val={transaction[column.key]} />
&nbsp;
            {t('LSK')}
          </React.Fragment>
        );
      case 'timestamp':
        return (
          <DateTimeFromTimestamp time={transaction[column.key]} token="LSK" />
        );
      case 'confirmations':
        return transaction.confirmations > 0
          ? <Icon name="approved" /> : <Icon name="pending" />;
      default:
        return transaction[column.key];
    }
  };


  return (
    <Box width="full">
      <Box.Header>
        <h1>{t(title)}</h1>
      </Box.Header>
      <div>
        {!!transactions.data.data && transactions.data.data.length && (
        <React.Fragment>
          <TableRow isHeader>
            {columns.map(column => (
              <div key={column.key} className={column.className}>{t(column.header)}</div>
            ))}
          </TableRow>
          {transactions.data.data.map(transaction => (
            <TableRow key={transaction.id} className={`${grid.row}`}>
              {columns.map(column => (
                <span key={column.key} className={column.className}>
                  {renderCellContent(column, transaction)}
                </span>
              ))}
            </TableRow>
          ))}
        </React.Fragment>
        )}
      </div>
    </Box>
  );
};

export default withTranslation()(TransactionsTable);
