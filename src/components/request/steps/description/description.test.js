import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import PropTypes from 'prop-types';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { spy } from 'sinon';
import i18n from '../../../../i18n';
import Description from './description';


describe('Description', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      address: '12345L',
      t: key => key,
      goToTransationPage: spy(),
      nextStep: spy(),
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

    wrapper = mount(<Description {...props}/>, {
      context: { store, i18n },
      childContextTypes: {
        store: PropTypes.object.isRequired,
        i18n: PropTypes.object.isRequired,
      },
    });
  });

  it('render Description component', () => {
    expect(wrapper.exists()).to.equal(true);
  });

  it('render qrc code with correct address', () => {
    expect(wrapper.find('QRCode').get(0).props.value).to.equal(props.address);
  });

  it('callde the back function', () => {
    wrapper.find('.back').at(0).simulate('click');
    wrapper.update();
    expect(props.goToTransationPage).to.have.been.calledWith();
  });

  it('callde the next function', () => {
    wrapper.find('.specify-request').at(0).simulate('click');
    wrapper.update();
    expect(props.nextStep).to.have.been.calledWith();
  });
});
