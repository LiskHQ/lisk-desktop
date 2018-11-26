import React from 'react';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';

import Request from './request';

describe('Render Request', () => {
  let wrapper;
  let props;
  let history;
  const store = {};

  beforeEach(() => {
    history = {
      location: {
        pathname: 'request',
        search: '',
      },
      push: () => {},
    };

    props = {
      history,
      address: '12345L',
      t: key => key,
      settings: {
        currency: 'USD',
      },
    };

    store.getState = () => ({
      account: {
        address: '12345L',
      },
      settings: {
        currency: 'USD',
      },
    });

    store.subscribe = () => {};
    store.dispatch = () => {};

    wrapper = mount(<Provider store={store}><Request {...props}/></Provider>);
    wrapper.setState(Object.assign({}, {
      step: 1,
      recipient: { value: '12345L' },
      reference: { value: '' },
      amount: { value: '' },
      enableMessage: true,
    }));
  });

  it('Check if Request component exists', () => {
    expect(wrapper.exists()).to.equal(true);
  });

  it('QRCode render', () => {
    expect(wrapper.find('QRCode')).to.have.length(1);
  });

  it('CopyToClipboad render with correct adddress', () => {
    expect(wrapper.find('CopyToClipboard').get(0).props.value).to.equal('12345L');
  });

  it('Description text render with data', () => {
    const descriptionText = 'This is your Lisk ID shown as a QR code. You can scan it with our Lisk Mobileapp available on Google Play & the AppStore or any QR code reader.';
    expect(wrapper.find('p').get(0).props.children).to.contain(descriptionText);
  });

  it('Click next function', () => {
    expect(wrapper.find('Button').at(1)).to.have.length(1);
    wrapper.find('Button').at(1).simulate('click');
    wrapper.update();
    expect(wrapper.state().step).to.equal(1);
  });

  it('Click back function step = 1', () => {
    expect(wrapper.find('Button').at(1)).to.have.length(1);
    wrapper.setState({ step: 2 });
    wrapper.find('Button').at(0).simulate('click');
    wrapper.update();
    expect(wrapper.exists()).to.equal(true);
  });

  it('Click back function, step = 2', () => {
    expect(wrapper.find('Button').at(1)).to.have.length(1);
    wrapper.setState({ step: 2 });
    wrapper.find('Button').at(0).simulate('click');
    wrapper.update();
    expect(wrapper.exists()).to.equal(true);
  });

  it('Click close messange', () => {
    expect(wrapper.find('.closeIcon')).to.have.length(1);
    wrapper.find('.closeIcon').simulate('click');
    wrapper.update();
    expect(wrapper.exists()).to.equal(true);
  });
});
