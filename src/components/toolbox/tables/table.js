import React from 'react';
import { themr } from 'react-css-themr';

import {
  Table as ToolBoxTable,
  TableRow as ToolBoxTableRow,
  TableCell as ToolBoxTableCell,
  TableHead as ToolBoxTableHead,
} from 'react-toolbox/lib/table';
import tableTheme from './css/table.css';

const TBTable = props => <ToolBoxTable {...props} theme={props.theme}/>;
const TBTableRow = props => <ToolBoxTableRow {...props} theme={props.theme}/>;
const TBTableCell = props => <ToolBoxTableCell {...props} theme={props.theme}/>;
const TBTableHead = props => <ToolBoxTableHead {...props} theme={props.theme}/>;

const Table = themr('table', tableTheme)(TBTable);

export default Table;
export { Table, TBTableRow, TBTableCell, TBTableHead };
