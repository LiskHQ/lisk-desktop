import React from 'react';
import { themr } from 'react-css-themr';
import {
  Table as ToolBoxTable,
  TableRow as ToolBoxTableRow,
  TableCell as ToolBoxTableCell,
  TableHead as ToolBoxTableHead,
} from 'react-toolbox/lib/table';
import tableTheme from './css/table.css';
import tableCellTheme from './css/tableCell.css';
import tableRowtheme from './css/tableRow.css';
import tableHeadTheme from './css/tableHead.css';

class TBTable extends React.Component {
  render() {
    return <ToolBoxTable {...this.props} theme={this.props.theme} />;
  }
}

class TBTableRow extends React.Component {
  render() {
    return <ToolBoxTableRow {...this.props} theme={this.props.theme} />;
  }
}

class TBTableCell extends React.Component {
  render() {
    return <ToolBoxTableCell {...this.props} theme={this.props.theme} />;
  }
}

class TBTableHead extends React.Component {
  render() {
    return <ToolBoxTableHead {...this.props} theme={this.props.theme} />;
  }
}

const Table = themr('table', tableTheme)(TBTable);
const TableRow = themr('tableRow', tableRowtheme)(TBTableRow);
const TableCell = themr('tableCell', tableCellTheme)(TBTableCell);
const TableHead = themr('tableHead', tableHeadTheme)(TBTableHead);

export default Table;
export { Table, TableRow, TableCell, TableHead };
