import React from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
import { mount } from 'enzyme';
import PropTypes from 'prop-types';
import i18n from '../../i18n';
import TransactionDetailView from './transactionDetailView';

describe('TransactionDetailView', () => {
  it('should render 4 rows', () => {
    const props = {
      prevStep: spy(),
      t: () => {},
      value: {
        senderId: '',
        recipientId: '',
        timestamp: '',
        fee: '',
        confirmations: '',
        id: '',
      },
    };
    const wrapper = mount(<TransactionDetailView {...props} />,
      {
        context: { i18n },
        childContextTypes: {
          i18n: PropTypes.object.isRequired,
        },
      });

    const expectedValue = /flexboxgrid__row/g;
    const html = wrapper.html();
    expect(html.match(expectedValue)).to.have.lengthOf(4);
    wrapper.find('#transactionDetailsBackButton').simulate('click');
    expect(props.prevStep).to.have.been.calledWith();
  });
});
