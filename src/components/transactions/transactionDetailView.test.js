import React from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
import { mountWithContext } from '../../../test/utils/mountHelpers';
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
      history: { push: () => {}, location: { search: '' } },
    };
    const wrapper = mountWithContext(<TransactionDetailView {...props} />, { });

    const expectedValue = /flexboxgrid__row/g;
    const html = wrapper.html();
    expect(html.match(expectedValue)).to.have.lengthOf(4);
    wrapper.find('#transactionDetailsBackButton').simulate('click');
    expect(props.prevStep).to.have.been.calledWith();
  });
});
