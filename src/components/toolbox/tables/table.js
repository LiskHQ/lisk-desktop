import React from 'react';
import { themr } from 'react-css-themr';
import { Table as ToolBoxTable, TableHead, TableRow, TableCell } from 'react-toolbox/lib/table';
import tableTheme from './css/table.css';

const MTable = props => <ToolBoxTable {...props} theme={props.theme}/>;
const TBTable = themr('table', tableTheme)(MTable);

export {
  TBTable,
  TableHead as TBTableHead,
  TableRow as TBTableRow,
  TableCell as TBTableCell,
};
