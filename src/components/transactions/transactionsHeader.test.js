import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import tableStyle from 'react-toolbox/lib/table/theme.css';
import TransactionsHeader from './transactionsHeader';

describe('TransactionsHeader', () => {
  it('should have 6 "th" tags', () => {
    const wrapper = shallow(<TransactionsHeader tableStyle={tableStyle}></TransactionsHeader>);
    expect(wrapper.find('th')).to.have.lengthOf(6);
  });
});
