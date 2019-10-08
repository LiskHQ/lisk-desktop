import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import TableRow from './tableRow';

const Table = ({ data, columns }) => (
  <React.Fragment>
    {!!data.length && (
    <TableRow isHeader className={`${grid.row}`}>
      {columns.map(({ className, header, id }) => (
        <div className={className} key={id}>{header}</div>
      ))}
    </TableRow>
    )}
    {data.map(row => (
      <TableRow key={row.id} className={`${grid.row}`}>
        {columns.map(({ className, id, getValue }) => (
          <span className={className} key={id}>
            {typeof getValue === 'function' ? getValue(row) : row[id]}
          </span>
        ))}
      </TableRow>
    ))}
  </React.Fragment>
);

export default Table;
