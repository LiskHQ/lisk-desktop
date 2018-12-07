import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import PropTypes from 'prop-types';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { spy } from 'sinon';
import i18n from '../../i18n';
import ReceiveConfirmation from './receiveConfirmation';

describe('ReceiveConfirmation', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    const history = {
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
      prevStep: spy(),
      goToTransationPage: spy(),
    };

    const store = configureMockStore([thunk])({
      settings: { currency: 'USD' },
      settingsUpdated: () => {},
      liskService: {
        success: true,
        LSK: {
          USD: 1,
        },
      },
    });

    wrapper = mount(<ReceiveConfirmation {...props}/>, {
      context: { store, i18n },
      childContextTypes: {
        store: PropTypes.object.isRequired,
        i18n: PropTypes.object.isRequired,
      },
    });
  });

  it('render ReceiveConfirmation component', () => {
    expect(wrapper.exists()).to.equal(true);
  });

  it('link change when reference value change', () => {
    wrapper.find('Button').at(1).simulate('click');
    wrapper.update();
    const event = {
      target: { value: 'test' },
    };

    wrapper.find('.reference input').simulate('change', event);
    expect(wrapper.find('.request-link').at(0).text()).to.contain('reference=test');
  });

  it('link change when amount value change', () => {
    wrapper.find('Button').at(1).simulate('click');
    wrapper.update();
    const event = {
      target: { value: '0.1' },
    };

    wrapper.find('.amount input').simulate('change', event);
    expect(wrapper.find('.request-link').at(0).text()).to.contain('amount=0.1');
  });

  it('recognizes too big reference length', () => {
    wrapper.find('Button').at(1).simulate('click');
    wrapper.update();
    wrapper.find('.reference input').simulate('change', { target: { value: 'test'.repeat(100) } });
    expect(wrapper.find('Input.reference').text()).to.contain('Maximum length exceeded');
  });

  it('recognizes invalid amount', () => {
    wrapper.find('Button').at(1).simulate('click');
    wrapper.update();
    wrapper.find('.amount input').simulate('change', { target: { value: '120 INVALID' } });
    expect(wrapper.find('Input.amount').text()).to.contain('Invalid amount');
  });

  it('recognizes empty amount', () => {
    wrapper.find('Button').at(1).simulate('click');
    wrapper.update();
    wrapper.find('.amount input').simulate('change', { target: { value: '12000' } });
    wrapper.find('.amount input').simulate('change', { target: { value: '' } });
    expect(wrapper.find('Input.amount').text()).to.contain('Required');
  });

  it('callde the back function', () => {
    wrapper.find('.back').at(0).simulate('click');
    wrapper.update();
    expect(props.prevStep).to.have.been.calledWith();
  });

  it('callde the next function', () => {
    wrapper.find('.reference input').simulate('change', { target: { value: 'test' } });
    wrapper.update();
    wrapper.find('.amount input').simulate('change', { target: { value: '1' } });
    wrapper.update();
    wrapper.find('.okay-button').at(0).simulate('click');
    wrapper.update();
    expect(props.goToTransationPage).to.have.been.calledWith();
  });
});
