import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import Modal from './modal';

describe('Modal', () => {
  let wrapper;
  let props;

  it('renders modal with success template', () => {
    const title = 'Thank you';
    const body = 'Transaction is being processed and will be confirmed. It may take up to 15 minutes to be secured in the blockchain.';
    const copy = {
      title: 'Copy Transaction-ID to clipboard',
      value: '1234',
    };
    props = {
      copy,
      title,
      body,
      success: true,
      callback: () => {},
      copyToClipboard: () => {},
      t: () => {},
    };

    wrapper = mount(<Modal {...props} />);

    expect(wrapper.find('h2').text()).to.contain(title);
    expect(wrapper.find('.modal-message').text()).to.contain(body);
    expect(wrapper.find('.material-icons').text()).to.contain('check');
    expect(wrapper.find('.copy-title').text()).to.contain(copy.title);
  });

  it('renders modal with failure template', () => {
    const title = 'Sorry';
    const body = 'An error occurred while creating the transaction.';
    props = {
      copy: null,
      title,
      body,
      success: false,
      callback: () => {},
      copyToClipboard: () => {},
      t: () => {},
    };

    wrapper = mount(<Modal {...props} />);

    expect(wrapper.find('h2').text()).to.contain(title);
    expect(wrapper.find('.modal-message').text()).to.contain(body);
    expect(wrapper.find('.material-icons').text()).to.contain('clear');
    expect(wrapper.find('.copy-title')).to.have.length(0);
  });
});
