import React from 'react';
import { expect } from 'chai';

import { mountWithContext } from '../../../test/utils/mountHelpers';
import MultiStep from '../multiStep';
import Send from './index';
import styles from './send.css';

describe('Send', () => {
  let wrapper;
  let transactions;
  let peers;
  let storeState;
  let context;

  beforeEach(() => {
    transactions = {};
    peers = {
      data: {},
      options: {},
    };
    storeState = {
      peers,
      transactions,
      account: { serverPublicKey: 'public_key', balance: 0 },
    };

    context = {
      storeState,
    };
    wrapper = mountWithContext(<Send history={ { location: {} } } account={storeState.account}/>,
      context);
  });

  it('should render MultiStep component ', () => {
    expect(wrapper.find(MultiStep)).to.have.lengthOf(1);
  });

  it('clicking send menu item should activate the send component', () => {
    wrapper.find('.send-menu-item').simulate('click');
    expect(wrapper.find('.send-box').first()).to.have.className(styles.isActive);
  });
});

