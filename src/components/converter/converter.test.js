import { expect } from 'chai';
import sinon from 'sinon';
import React from 'react';
import configureStore from 'redux-mock-store';

import { mountWithContext } from '../../../test/utils/mountHelpers';
import liskServiceApi from '../../utils/api/liskService';
import Converter from './index';

describe('Converter', () => {
  let explorereApiMock;
  let wrapper;
  const fakeStore = configureStore();
  const store = fakeStore({
    settings: {},
    settingsUpdated: () => {},
  });

  beforeEach(() => {
    explorereApiMock = sinon.stub(liskServiceApi, 'getPriceTicker').returnsPromise();
  });

  afterEach(() => {
    explorereApiMock.restore();
  });

  it('shold render Converter component', () => {
    const props = {
      t: () => {},
    };
    wrapper = mountWithContext(<Converter {...props} store={store}/>, { storeState: store });
    expect(wrapper.find('Converter')).to.have.present();
  });

  it('should change active price', () => {
    const props = {
      t: () => {},
      value: 0,
      error: false,
    };
    wrapper = mountWithContext(<Converter {...props} store={store}/>, { storeState: store });
    expect(wrapper.find('.converted-price').at(1).text()).to.have.equal('USD');
    wrapper.find('.converted-price').at(2).simulate('click');
    expect(wrapper.find('.converted-price').at(1).text()).to.have.equal('EUR');
  });

  it('should convert price to EUR from localStorage', () => {
    const storeWithCurrency = fakeStore({
      settings: { currency: 'USD' },
      settingsUpdated: () => {},
    });

    const props = {
      t: () => {},
      value: 2,
      error: false,
      currency: 'USD',
    };

    wrapper = mountWithContext(
      <Converter {...props} store={storeWithCurrency}/>,
      { storeState: storeWithCurrency },
    );

    explorereApiMock.resolves({ LSK: { USD: 123, EUR: 12 } });
    wrapper.update();
    expect(wrapper.find('.converted-price').at(0).text()).to.have.equal('~ 246.00');
  });
});

