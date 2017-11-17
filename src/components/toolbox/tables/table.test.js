import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import Table from './table';

describe('Table wrapper', () => {
  it('Creates only one instance of the table', () => {
    const wrappedTable = mount(<Table/>);
    expect(wrappedTable.find('Table').length).to.equal(1);
  });
});
