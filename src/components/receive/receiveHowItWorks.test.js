import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import PropTypes from 'prop-types';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { spy } from 'sinon';
import i18n from '../../i18n';
import ReceiveHowItWorks from './receiveHowItWorks';


describe('ReceiveHowItWorks', () => {
  let wrapper;
  let props;
  let store;

  beforeEach(() => {
    props = {
      address: '12345L',
      t: key => key,
      nextStep: spy(),
      prevStep: spy(),
      settingsUpdated: spy(),
      isMessage: false,
      status: 'foward',
    };

    store = configureMockStore([thunk])({
      settings: { currency: 'USD' },
      settingsUpdated: () => {},
      liskService: {
        success: true,
        LSK: {
          USD: 1,
        },
      },
    });

    wrapper = shallow(<ReceiveHowItWorks {...props}/>, {
      context: { store, i18n },
      childContextTypes: {
        store: PropTypes.object.isRequired,
        i18n: PropTypes.object.isRequired,
      },
    });
  });

  it('render ReceiveHowItWorks component', () => {
    expect(wrapper.exists()).to.equal(true);
  });

  it('continue to next component after click on X icon', () => {
    wrapper.find('.closeIcon').simulate('click');
    wrapper.update();
    expect(props.nextStep).to.have.been.calledWith();
  });

  it('display message about how it works', () => {
    props.isMessage = true;
    wrapper = shallow(<ReceiveHowItWorks {...props}/>, {
      context: { store, i18n },
      childContextTypes: {
        store: PropTypes.object.isRequired,
        i18n: PropTypes.object.isRequired,
      },
    });

    wrapper.find('.closeIcon').simulate('click');
    wrapper.update();
    expect(props.nextStep).to.have.been.calledWith();
  });
});
