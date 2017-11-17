import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { TBTable } from './table';

describe('Table wrapper', () => {
  it('Creates only one instance of the table', () => {
    const wrappedTable = mount(<TBTable/>);
    expect(wrappedTable.find('Table').length).to.equal(1);
  });
});
