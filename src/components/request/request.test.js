import React from 'react';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import PropTypes from 'prop-types';
import { mount } from 'enzyme';
import i18n from '../../i18n';
import Request from './';
import accounts from '../../../test/constants/accounts';
import { tokenMap } from '../../constants/tokens';

describe('Request', () => {
  let wrapper;

  const store = configureMockStore([thunk])({
    settings: { currency: 'USD', token: { active: tokenMap.LSK.key } },
    settingsUpdated: () => {},
    liskService: {
      success: true,
      LSK: {
        USD: 1,
      },
    },
  });

  const options = {
    context: { i18n, store },
    childContextTypes: {
      i18n: PropTypes.object.isRequired,
      store: PropTypes.object.isRequired,
    },
  };

  const props = {
    address: accounts.genesis.address,
  };

  beforeEach(() => {
    wrapper = mount(<Request {...props} />, options);
  });

  it('Should render without showing QRCode', () => {
    expect(wrapper.find('.formSection')).toExist();
    expect(wrapper.find('.qrSection')).toExist();
    expect(wrapper.find('.qrSection.hide')).toExist();
    expect(wrapper.find('.qrSection').hasClass('hide')).toBeTruthy();
  });

  it('Should toogle qrSection', () => {
    expect(wrapper.find('.qrSection').hasClass('hide')).toBeTruthy();
    wrapper.find('.formSection .footerActionable').simulate('click');
    expect(wrapper.find('.qrSection').hasClass('hide')).toBeFalsy();
    expect(wrapper.find('.formSection .footerContent').hasClass('hide')).toBeTruthy();
    wrapper.find('.qrSection .footerActionable').simulate('click');
    expect(wrapper.find('.qrSection').hasClass('hide')).toBeTruthy();
    expect(wrapper.find('.formSection .footerContent').hasClass('hide')).toBeFalsy();
  });

  describe('Amount field', () => {
    it('Should show converter on correct input', () => {
      const evt = { target: { name: 'amount', value: 1 } };
      let amountField = wrapper.find('.fieldGroup').at(0);
      expect(amountField.find('.converted-price')).not.toExist();
      amountField.find('InputV2').simulate('change', evt);
      wrapper.update();
      amountField = wrapper.find('.fieldGroup').at(0);
      expect(amountField.find('.converted-price')).toExist();
    });

    it('Should add leading 0 if . is inserted as first character', () => {
      const evt = { target: { name: 'amount', value: '.1' } };
      wrapper.find('.fieldGroup InputV2').simulate('change', evt);
      wrapper.update();
      expect(wrapper.find('.fieldGroup InputV2').props().value).toEqual('0.1');
    });

    it('Should show error feedback if letters inserted', () => {
      const evt = { target: { name: 'amount', value: 'abc' } };
      expect(wrapper.find('.fieldGroup .feedback.error')).not.toExist();
      wrapper.find('.fieldGroup InputV2').simulate('change', evt);
      wrapper.update();
      expect(wrapper.find('.fieldGroup .feedback.error')).toExist();
    });

    it('Should show error feedback if ending in . or multiples .', () => {
      const evt = { target: { name: 'amount', value: 1 } };
      const multipleDotsEvt = { target: { name: 'amount', value: '1.2.3' } };
      const endingDotEvt = { target: { name: 'amount', value: '12.' } };
      const amountField = wrapper.find('.fieldGroup').at(0);
      amountField.find('InputV2').simulate('change', endingDotEvt);
      wrapper.update();
      expect(wrapper.find('.fieldGroup .feedback.error')).toExist();
      amountField.find('InputV2').simulate('change', evt);
      wrapper.update();
      expect(wrapper.find('.fieldGroup .feedback.error')).not.toExist();
      amountField.find('InputV2').simulate('change', multipleDotsEvt);
      wrapper.update();
      expect(wrapper.find('.fieldGroup .feedback.error')).toExist();
    });
  });

  describe('Reference field', () => {
    it('Should show feedback if some text inserted and hide if empty', () => {
      const referenceField = wrapper.find('.fieldGroup').at(1);
      let evt = { target: { name: 'reference', value: 'test' } };
      expect(wrapper.find('.fieldGroup .feedback.show')).not.toExist();
      referenceField.find('AutoresizeTextarea').simulate('change', evt);
      wrapper.update();
      expect(wrapper.find('.fieldGroup .feedback.show')).toExist();
      expect(wrapper.find('.fieldGroup .feedback.error')).not.toExist();

      evt = { target: { name: 'reference', value: '' } };
      referenceField.find('AutoresizeTextarea').simulate('change', evt);
      wrapper.update();
      // expect(referenceField.find('.feedback').first()).to.not.have.className('show');
      expect(wrapper.find('.fieldGroup .feedback.show')).not.toExist();
    });

    it('Should show error feedback over limit of characters', () => {
      const referenceField = wrapper.find('.fieldGroup').at(1);
      const evt = {
        target: {
          name: 'reference',
          value: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit volutpat.',
        },
      };
      referenceField.find('AutoresizeTextarea').simulate('change', evt);
      wrapper.update();
      expect(wrapper.find('.fieldGroup .feedback.show')).toExist();
      expect(wrapper.find('.fieldGroup .feedback.error')).toExist();
    });
  });

  describe('Share Link', () => {
    it('Should update share link with amount and reference', () => {
      const shareLink = `lisk://wallet/send?recipient=${props.address}`;
      let evt;
      expect(wrapper.find('.request-link').first().html()).toMatch(shareLink);

      evt = { target: { name: 'reference', value: 'test' } };
      wrapper.find('.fieldGroup').at(1).find('AutoresizeTextarea').simulate('change', evt);
      expect(wrapper.find('.request-link').first().html()).toContain(`${evt.target.name}=${evt.target.value}`);

      evt = { target: { name: 'amount', value: 1 } };
      wrapper.find('.fieldGroup').at(0).find('InputV2').simulate('change', evt);
      expect(wrapper.find('.request-link').first().html()).toContain(`${evt.target.name}=${evt.target.value}`);
    });

    it('Should copy and set timeout on click', () => {
      expect(wrapper.find('.copy-button button').props().disabled).toBeFalsy();
      wrapper.find('.copy-button button').simulate('click');
      expect(wrapper.find('.copy-button button').props().disabled).toBeTruthy();
      jest.advanceTimersByTime(3100);
      wrapper.update();
      expect(wrapper.find('.copy-button button').props().disabled).toBeFalsy();
    });

    it('Should render BTC reqest if props.token is BTC', () => {
      wrapper = mount(<Request {...props} token='BTC' />, options);
      expect(wrapper.find('.copy-button button').text()).toMatch('Copy address');
    });
  });
});
