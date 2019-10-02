import React from 'react';
import { Link } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import Box from '../../toolbox/box';
import TableRow from '../../toolbox/table/tableRow';

const TransactionsTable = ({
  t, title, columns, transactions,
}) => {
  const renderCell = (column, transaction) => {
    if (column.isLink) {
      return (
        <span key={column.key} className={column.className}>
          <Link to={`${column.pathPrefix}/${transaction[column.key]}`}>
            {transaction[column.key]}
          </Link>
        </span>
      );
    }
    return (
      <span key={column.key} className={column.className}>{transaction[column.key]}</span>
    );
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
              {columns.map(column => renderCell(column, transaction))}
            </TableRow>
          ))}
        </React.Fragment>
        )}
      </div>
    </Box>
  );
};

export default withTranslation()(TransactionsTable);
