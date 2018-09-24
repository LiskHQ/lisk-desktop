import React from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
import { mountWithContext } from './../../../test/utils/mountHelpers';
// import liskServiceApi from '../../utils/api/liskService';

import SpecifyRequest from './specifyRequest';

describe('Specify Request', () => {
  let wrapper;
  let props;
  let storeState;
  // let liskServiceApiMock;

  beforeEach(() => {
    storeState = {
      settings: {},
      settingsUpdated: () => {},
      // priceTicker: () => {},
    };

    const context = {
      storeState,
    };

    props = {
      t: key => key,
      address: '234l',
      nextStep: spy(),
      prevStep: spy(),
    };

    // const priceTicker = {
    //   success: true,
    //   tickers: {
    //     LSK: {
    //       BTC: 0.00050824
    //     }
    //   }
    // }

    // liskServiceApiMock = stub(liskServiceApi, 'getPriceTicker').returnsPromise();

    wrapper = mountWithContext(<SpecifyRequest {...props} />, context);
    // liskServiceApiMock.resolves(priceTicker);
    // wrapper.update();
  });

  // afterEach(() => {
  //   liskServiceApiMock.restore();
  // });

  it('accepts valid amount', () => {
    wrapper.find('.amount input').simulate('change', { target: { value: '120.25' } });
    expect(wrapper.find('Input.amount').text()).to.not.contain('Invalid amount');
  });

  it('recognizes invalid amount', () => {
    wrapper.find('.amount input').simulate('change', { target: { value: '120 INVALID' } });
    expect(wrapper.find('Input.amount').text()).to.contain('Invalid amount');
  });

  it('recognizes zero amount', () => {
    wrapper.find('.amount input').simulate('change', { target: { value: '0' } });
    expect(wrapper.find('Input.amount').text()).to.contain('Required');
  });


  it('recognizes empty amount', () => {
    wrapper.find('.amount input').simulate('change', { target: { value: '12000' } });
    wrapper.find('.amount input').simulate('change', { target: { value: '' } });
    expect(wrapper.find('Input.amount').text()).to.contain('Required');
  });
});
