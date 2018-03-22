import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import TransactionOverview from './transactionOverview';

describe('TransactionOverview', () => {
  it('should render Waypoint on smallScreen', () => {
    window.innerWidth = 200;
    const props = {
      t: () => {},
      loading: [],
      transactions: [],
      peers: {},
    };
    const wrapper = shallow(<TransactionOverview {...props} />);
    expect(wrapper).to.have.descendants('Waypoint');
  });
});
