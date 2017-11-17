import React from 'react';
import { themr } from 'react-css-themr';

import { Table as ToolBoxTable } from 'react-toolbox/lib/table';
import tableTheme from './css/table.css';

const TBTable = props => <ToolBoxTable {...props} theme={props.theme}/>;
const Table = themr('table', tableTheme)(TBTable);

export default Table;
