import React from 'react';
import { expect } from 'chai';
import configureMockStore from 'redux-mock-store';
import { mountWithContext } from './../../../test/utils/mountHelpers';
import SendTo from './index';
import routes from './../../constants/routes';

describe('SendTo Component', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    const account = {
      address: '12345L',
      isDelegate: true,
    };
    const store = configureMockStore([])({
      account,
      search: {},
      activePeerSet: () => {},
    });
    props = {
      account,
      delegate: {
        username: 'peter',
      },
      t: key => key,
    };
    wrapper = mountWithContext(<SendTo {...props} store={store} />, { storeState: store });
    wrapper.setProps({ account });
  });

  it('renders correct link', () => {
    expect(wrapper.find('Link').prop('to')).to.equal(`${routes.wallet.path}?recipient=${props.address}`);
  });

  it('updates when address changes', () => {
    wrapper.setProps({ address: '9876L' });
    wrapper.update();
    expect(wrapper.find('Link').prop('to')).to.equal(`${routes.wallet.path}?recipient=9876L`);
  });

  it('renders delegate username', () => {
    expect(wrapper.find('.delegate-name').first()).to.have.text('peter');
  });
});
