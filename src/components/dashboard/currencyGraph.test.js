import { expect } from 'chai';
import { Line as LineChart } from 'react-chartjs-2';
import sinon from 'sinon';
import React from 'react';

import liskServiceApi from '../../utils/api/liskService';
import { mountWithContext } from '../../../test/utils/mountHelpers';
import CurrencyGraph from './currencyGraph';

describe('CurrencyGraph', () => {
  let explorereApiMock;
  let wrapper;

  beforeEach(() => {
    explorereApiMock = sinon.stub(liskServiceApi, 'getCurrencyGrapData').returnsPromise();
    wrapper = mountWithContext(<CurrencyGraph/>, {});
  });

  afterEach(() => {
    explorereApiMock.restore();
  });

  it('shold render LineChart when explorer api resolves candle data', () => {
    const candles = [
      { high: 0.003223542, date: '2018-02-01 13:00:00' },
      { high: 0.012344282, date: '2018-02-01 14:00:00' },
    ];

    expect(wrapper.find(LineChart)).not.to.be.present();
    explorereApiMock.resolves({ candles });
    wrapper.update();
    expect(wrapper.find(LineChart)).to.be.present();
  });

  it('shold show and error message when explorer api call fails', () => {
    expect(wrapper.find(LineChart)).not.to.be.present();
    explorereApiMock.rejects({ });
    expect(wrapper.find(LineChart)).not.to.be.present();
    expect(wrapper.text()).to.contain('Price data currently not available');
  });

  it('should allow to change step', () => {
    const candles = [
      { high: 0.003223542, date: '2018-02-01 13:00:00' },
      { high: 0.012344282, date: '2018-02-02 13:00:00' },
    ];

    wrapper.find('.step').at(1).simulate('click');
    expect(wrapper.find(LineChart)).not.to.be.present();
    explorereApiMock.resolves({ candles });
    wrapper.update();
    expect(wrapper.find(LineChart)).to.be.present();
  });
});

