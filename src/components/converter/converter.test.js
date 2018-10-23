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
      t: key => key,
    };
    wrapper = mountWithContext(<Converter {...props} store={store}/>, { storeState: store });
    expect(wrapper.find('Converter')).to.have.present();
  });

  it('should convert price to EUR from localStorage', () => {
    const storeWithCurrency = fakeStore({
      settings: { currency: 'USD' },
      settingsUpdated: () => {},
    });

    const props = {
      t: key => key,
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
    expect(wrapper.find('.converted-price').at(0)).to.have.text('246.00 USD');
  });


  it('shold set max. amount', () => {
    const storeWithCurrency = fakeStore({
      settings: { currency: 'USD' },
      settingsUpdated: () => {},
    });

    const props = {
      t: key => key,
      value: '',
      error: false,
      currency: 'USD',
      onSetMaxAmount: sinon.spy(),
    };

    wrapper = mountWithContext(
      <Converter {...props} store={storeWithCurrency}/>,
      { storeState: storeWithCurrency },
    );

    wrapper.find('.set-max-amount').simulate('click');
    /* eslint-disable no-unused-expressions */
    expect(props.onSetMaxAmount).to.have.been.calledOnce;
    /* eslint-enable no-unused-expressions */
  });
});
