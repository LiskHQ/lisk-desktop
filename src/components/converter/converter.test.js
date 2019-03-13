import { expect } from 'chai';
import React from 'react';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { mountWithContext } from '../../../test/unit-test-utils/mountHelpers';
import Converter from './index';

describe('Converter', () => {
  let wrapper;

  const store = configureMockStore([thunk])({
    settings: { currency: 'USD' },
    settingsUpdated: () => {},
    getPriceTicker: () => {},
    liskService: {},
  });

  it('shold render Converter component', () => {
    const props = {
      t: key => key,
      settings: { currency: 'EUR' },
      priceTicker: { LSK: { USD: 123, EUR: 12 } },
    };

    wrapper = mountWithContext(<Converter {...props} store={store}/>, { storeState: store });
    expect(wrapper.find('Converter')).to.have.present();
  });
});
