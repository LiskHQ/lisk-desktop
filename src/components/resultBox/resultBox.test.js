import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import ResultBox from './resultBox';

describe('Result Box', () => {
  let wrapper;
  let props;

  it('renders result box with success template', () => {
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

    wrapper = mount(<ResultBox {...props} />);

    expect(wrapper.find('h2').text()).to.contain(title);
    expect(wrapper.find('.result-box-message').text()).to.contain(body);
    expect(wrapper.find('.material-icons')).to.have.length(0);
    expect(wrapper.find('img')).to.have.length(2);
    expect(wrapper.find('.copy-title').text()).to.contain(copy.title);
  });

  it('renders result box with failure template', () => {
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

    wrapper = mount(<ResultBox {...props} />);

    expect(wrapper.find('h2').text()).to.contain(title);
    expect(wrapper.find('.result-box-message').text()).to.contain(body);
    expect(wrapper.find('.material-icons')).to.have.length(1);
    expect(wrapper.find('img')).to.have.length(0);
    expect(wrapper.find('.copy-title')).to.have.length(0);
  });
});
