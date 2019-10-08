import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import TableRow from './tableRow';

const Table = ({ data, columns }) => (
  <React.Fragment>
    {!!data.length && (
    <TableRow isHeader className={`${grid.row}`}>
      {columns.map(({ className, header }) => (
        <div className={className} key={header}>{header}</div>
      ))}
    </TableRow>
    )}
    {data.map(block => (
      <TableRow key={block.id} className={`${grid.row}`}>
        {columns.map(({ className, header, getValue }) => (
          <span className={className} key={header}>{getValue(block)}</span>
        ))}
      </TableRow>
    ))}
  </React.Fragment>
);

export default Table;
