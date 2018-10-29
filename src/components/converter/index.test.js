import React from 'react';
import thunk from 'redux-thunk';
import { expect } from 'chai';
import { spy } from 'sinon';
import configureMockStore from 'redux-mock-store';
import ConverterHOC from './index';
import { mountWithContext } from './../../../test/utils/mountHelpers';
import * as settingsActions from '../../actions/settings';

describe('ConverterHOC', () => {
  let wrapper;
  const peers = {
    data: {},
    status: true,
  };
  const account = {};
  const transactions = { pending: [] };
  beforeEach(() => {
    const store = configureMockStore([thunk])({
      peers,
      account,
      transactions,
      settings: { currency: 'USD' },
      settingsUpdated: () => {},
      getPriceTicker: () => {},
      liskService: {},
    });
    const props = {
      t: () => {},
      store,
    };

    wrapper = mountWithContext(<ConverterHOC {...props} />, { storeState: store });
  });

  it('should render Send', () => {
    expect(wrapper.find('Converter')).to.have.lengthOf(1);
  });

  it('should bind settingsUpdated action to SendWritable props.settingsUpdated', () => {
    const actionsSpy = spy(settingsActions, 'settingsUpdated');
    wrapper.find('Converter').props().settingsUpdated({ currency: 'EUR' });
    expect(actionsSpy).to.be.calledWith({ currency: 'EUR' });
    actionsSpy.restore();
  });
});
