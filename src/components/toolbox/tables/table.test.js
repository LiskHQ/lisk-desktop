import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { Table, TBTableRow, TBTableCell, TBTableHead } from './table';

describe('Table wrapper', () => {
  it('Creates only one instance of the table', () => {
    const wrappedTable = mount(<Table/>);
    expect(wrappedTable.find('Table').length).to.equal(1);
  });

  it('Creates only one instance of the TableHead ', () => {
    const wrappedTable = mount(<TBTableHead/>);
    expect(wrappedTable.find('TBTableHead').length).to.equal(1);
  });

  it('Creates only one instance of the TableRow', () => {
    const wrappedTableRow = mount(<TBTableRow/>);
    expect(wrappedTableRow.find('TBTableRow').length).to.equal(1);
  });

  it('Creates only one instance of the TBTableCell ', () => {
    const wrappedTableCell = mount(<TBTableCell/>);
    expect(wrappedTableCell.find('TBTableCell').length).to.equal(1);
  });
});
