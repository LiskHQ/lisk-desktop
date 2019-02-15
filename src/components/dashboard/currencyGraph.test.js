import thunk from 'redux-thunk';
import { expect } from 'chai';
import { Line as LineChart } from 'react-chartjs-2';
import sinon from 'sinon';
import React from 'react';
import { mountWithContext } from '../../../test/unit-test-utils/mountHelpers';
import { prepareStore } from '../../../test/unit-test-utils/applicationInit';
import liskServiceApi from '../../utils/api/liskService';

import liskServiceReducer from '../../store/reducers/liskService';
import CurrencyGraph from './currencyGraph';

describe('CurrencyGraph', () => {
  let liskServiceApiMock;
  let wrapper;
  let store;

  const prices = [
    { high: 0.003223542, date: '2018-02-01 13:00:00' },
    { high: 0.012344282, date: '2018-02-02 13:00:00' },
  ];

  beforeEach(() => {
    liskServiceApiMock = sinon.stub(liskServiceApi, 'getCurrencyGraphData').returnsPromise();
    store = prepareStore({
      liskService: liskServiceReducer,
    }, [thunk]);

    wrapper = mountWithContext(<CurrencyGraph store={store}/>, {});
  });

  afterEach(() => {
    liskServiceApiMock.restore();
  });

  it.skip('should render LineChart when explorer api resolves candle data', () => {
    expect(wrapper.find('.chart-wrapper').first()).to.be.present();
    expect(wrapper.find(LineChart)).not.to.be.present();
    liskServiceApiMock.resolves({ prices });
    wrapper.update();
    expect(wrapper.find(LineChart)).to.be.present();
  });

  it('should show and error message when explorer api call fails', () => {
    expect(wrapper.find(LineChart)).not.to.be.present();
    liskServiceApiMock.rejects({ });
    expect(wrapper.find(LineChart)).not.to.be.present();
    expect(wrapper.text()).to.contain('Price data currently not available');
  });

  it.skip('should allow to change step', () => {
    wrapper.find('.step').at(1).simulate('click');
    expect(wrapper.find(LineChart)).not.to.be.present();
    liskServiceApiMock.resolves({ prices });
    wrapper.update();
    expect(wrapper.find(LineChart)).to.be.present();
  });
});
