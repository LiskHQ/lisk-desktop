import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import PropTypes from 'prop-types';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import i18n from '../../i18n';
import Request from './receive';

describe('Render Request', () => {
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

    wrapper = mount(<Request {...props}/>, {
      context: { store, i18n },
      childContextTypes: {
        store: PropTypes.object.isRequired,
        i18n: PropTypes.object.isRequired,
      },
    });
  });

  it('render Request component', () => {
    expect(wrapper.exists()).to.equal(true);
  });

  it('go to transaction page on click back button', () => {
    wrapper.find('Button').at(0).simulate('click');
    wrapper.update();
  });

  // it('render QRCode when step = 1', () => {
  //   expect(wrapper.find('QRCode')).to.have.length(1);
  // });

  // it('render CopyToClipboad with correct adddress', () => {
  //   expect(wrapper.find('CopyToClipboard').get(0).props.value).to.equal('12345L');
  // });

  // it('call next function', () => {
  //   expect(wrapper.state().step).to.equal(1);
  //   expect(wrapper.find('Button').at(1)).to.have.length(1);
  //   wrapper.find('Button').at(1).simulate('click');
  //   wrapper.update();
  //   expect(wrapper.state().step).to.equal(2);
  // });

  // it('call back function when step = 1', () => {
  //   expect(wrapper.find('Button').at(1)).to.have.length(1);
  //   wrapper.find('Button').at(0).simulate('click');
  //   wrapper.update();
  //   expect(wrapper.state().step).to.equal(1);
  // });

  // it('call click back function, step = 2', () => {
  //   expect(wrapper.find('Button').at(1)).to.have.length(1);
  //   wrapper.find('Button').at(1).simulate('click');
  //   wrapper.update();
  //   expect(wrapper.state().step).to.equal(2);
  //   wrapper.find('Button').at(0).simulate('click');
  //   wrapper.update();
  //   expect(wrapper.state().step).to.equal(1);
  // });

  // it('close close messange description', () => {
  //   expect(wrapper.find('.isEnable')).to.have.length(0);
  //   wrapper.find('Button').at(1).simulate('click');
  //   wrapper.update();
  //   expect(wrapper.find('.isEnable')).to.have.length(1);
  //   expect(wrapper.find('.closeIcon')).to.have.length(1);
  //   wrapper.find('.closeIcon').simulate('click');
  //   wrapper.update();
  //   expect(wrapper.find('.isEnable')).to.have.length(0);
  // });

  // it('link change when reference value change', () => {
  //   wrapper.find('Button').at(1).simulate('click');
  //   wrapper.update();
  //   const event = {
  //     target: { value: 'test' },
  //   };

  //   wrapper.find('.reference input').simulate('change', event);
  //   expect(wrapper.find('.request-link').at(0).text()).to.contain('reference=test');
  // });

  // it('link change when amount value change', () => {
  //   wrapper.find('Button').at(1).simulate('click');
  //   wrapper.update();
  //   const event = {
  //     target: { value: '0.1' },
  //   };

  //   wrapper.find('.amount input').simulate('change', event);
  //   expect(wrapper.find('.request-link').at(0).text()).to.contain('amount=0.1');
  // });

  // it('recognizes too big reference length', () => {
  //   wrapper.find('Button').at(1).simulate('click');
  //   wrapper.update();
  //   const event = { target: { value: 'test'.repeat(100) } };
  //   wrapper.find('.reference input').simulate('change', event);
  //   expect(wrapper.find('Input.reference').text()).to.contain('Maximum length exceeded');
  // });

  // it('recognizes invalid amount', () => {
  //   wrapper.find('Button').at(1).simulate('click');
  //   wrapper.update();
  //   wrapper.find('.amount input').simulate('change', { target: { value: '120 INVALID' } });
  //   expect(wrapper.find('Input.amount').text()).to.contain('Invalid amount');
  // });

  // it('recognizes empty amount', () => {
  //   wrapper.find('Button').at(1).simulate('click');
  //   wrapper.update();
  //   wrapper.find('.amount input').simulate('change', { target: { value: '12000' } });
  //   wrapper.find('.amount input').simulate('change', { target: { value: '' } });
  //   expect(wrapper.find('Input.amount').text()).to.contain('Required');
  // });
});
