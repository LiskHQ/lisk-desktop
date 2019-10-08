import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import CheckBox from '../checkBox';
import DemoRenderer from '../demoRenderer';
import Table from '.';

const TableDemo = () => (
  <div>
    <h2>Table</h2>
    <DemoRenderer>
      <Table
        data={[
          { id: 1, name: 'Row 1' },
          { id: 2, name: 'Row 2' },
          { id: 3, name: 'Row 3' },
        ]}
        columns={[
          /* eslint-disable react/display-name */
          { className: grid['col-xs-1'], header: '', getValue: () => <CheckBox /> },
          { className: grid['col-xs-2'], header: 'ID', getValue: row => row.id },
          { className: grid['col-xs-6'], header: 'Name', getValue: row => <i>{row.name}</i> },
          { className: grid['col-xs-3'], header: 'Other', getValue: () => 'Something static' },
          /* eslint-enable react/display-name */
        ]}
      />
    </DemoRenderer>
  </div>
);

export default TableDemo;
