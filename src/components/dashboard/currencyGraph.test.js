import thunk from 'redux-thunk';
import { expect } from 'chai';
import { Line as LineChart } from 'react-chartjs-2';
import sinon from 'sinon';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import { mount } from 'enzyme';
import React from 'react';
import { Router } from 'react-router-dom';

import i18n from '../../i18n';
import history from '../../history';
import { prepareStore } from '../../../test/utils/applicationInit';
import liskServiceApi from '../../utils/api/liskService';

import liskServiceReducer from '../../store/reducers/liskService';
import CurrencyGraph from './currencyGraph';

describe('CurrencyGraph', () => {
  let explorereApiMock;
  let wrapper;
  let store;

  const prices = [
    { high: 0.003223542, date: '2018-02-01 13:00:00' },
    { high: 0.012344282, date: '2018-02-02 13:00:00' },
  ];

  beforeEach(() => {
    explorereApiMock = sinon.stub(liskServiceApi, 'getCurrencyGraphData').returnsPromise();
    store = prepareStore({
      liskService: liskServiceReducer,
    }, [thunk]);

    wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <I18nextProvider i18n={ i18n }>
            <CurrencyGraph />
          </I18nextProvider>
        </Router>
      </Provider>);
  });

  afterEach(() => {
    explorereApiMock.restore();
  });

  it('shold render LineChart when explorer api resolves candle data', () => {
    expect(wrapper.find('.chart-wrapper').first()).to.be.present();
    expect(wrapper.find(LineChart)).not.to.be.present();
    explorereApiMock.resolves({ prices });
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
    wrapper.find('.step').at(1).simulate('click');
    expect(wrapper.find(LineChart)).not.to.be.present();
    explorereApiMock.resolves({ prices });
    wrapper.update();
    expect(wrapper.find(LineChart)).to.be.present();
  });
});
