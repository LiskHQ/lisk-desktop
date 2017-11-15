import React from 'react';
import {
  Table as ToolBoxTable,
  TableRow as ToolBoxTableRow,
  TableCell as ToolBoxTableCell,
  TableHead as ToolBoxTableHead,
} from 'react-toolbox/lib/table';

const Table = props => <ToolBoxTable {...props} />;
const TableRow = props => <ToolBoxTableRow {...props} />;
const TableCell = props => <ToolBoxTableCell {...props} />;
const TableHead = props => <ToolBoxTableHead {...props} />;

export default Table;
export { Table, TableRow, TableCell, TableHead };
