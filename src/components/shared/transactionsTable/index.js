import React from 'react';
import { withTranslation } from 'react-i18next';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import Box from '../../toolbox/box';
import TableRow from '../../toolbox/table/tableRow';

const TransactionsTable = ({
  t, title, columns, transactions,
}) => (
  <Box width="full">
    <Box.Header>
      <h1>{t(title)}</h1>
    </Box.Header>
    <div>
      {!!transactions.data.length && (
        <React.Fragment>
          <TableRow isHeader>
            {columns.map(column => (
              <div key={column.header} className={column.className}>{t(column.header)}</div>
            ))}
          </TableRow>
          {transactions.data.map(transaction => (
            columns.map(column => (
              <TableRow key={transaction.id} className={`${grid.row}`}>
                <span className={column.className}>{column.header}</span>
              </TableRow>
            ))
          ))}
        </React.Fragment>
      )}
    </div>
    )
  </Box>
);

export default withTranslation()(TransactionsTable);
