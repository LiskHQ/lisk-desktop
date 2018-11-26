import React from 'react';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import RequestForm from './requestForm';

describe('Request Form', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      address: '12345L',
      amount: '0.1',
      error: undefined,
      onAmountChange: () => {},
      onReferenceChange: () => {},
      reference: { value: '' },
      t: key => key,
    };

    const priceTicker = {
      success: true,
      LSK: {
        USD: 1,
      },
    };

    const store = configureMockStore([thunk])({
      settings: {},
      settingsUpdated: () => {},
      liskService: { priceTicker },
    });

    wrapper = mount(<Provider store={store}>
      <RequestForm {...props}/>
    </Provider>);
  });

  it('Render RequestForm', () => {
    expect(wrapper.find('.requestForm')).to.have.length(1);
  });

  it('Render Account Visual', () => {
    expect(wrapper.find('AccountVisual')).to.have.length(1);
  });

  it('Render Reference Input', () => {
    expect(wrapper.find('ReferenceInput')).to.have.length(1);
  });

  it('Render Converter Input', () => {
    expect(wrapper.find('Converter')).to.have.length(1);
  });
});
