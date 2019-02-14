import React from 'react';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import PropTypes from 'prop-types';
import { expect } from 'chai';
import { useFakeTimers } from 'sinon';
import { mount } from 'enzyme';
import i18n from '../../i18n';
import RequestV2 from './requestV2';
import accounts from '../../../test/constants/accounts';
import { AutoresizeTextarea } from '../toolbox/inputsV2';

describe('RequestV2', () => {
  let wrapper;

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
    wrapper = mount(<RequestV2 {...props} />, options);
  });

  it('Should render without showing QRCode', () => {
    expect(wrapper).to.have.descendants('.formSection');
    expect(wrapper).to.have.descendants('.qrSection');
    expect(wrapper.find('.qrSection')).to.have.className('hide');
  });

  it('Should toogle qrSection', () => {
    expect(wrapper.find('.qrSection')).to.have.className('hide');
    wrapper.find('.formSection .footerActionable').simulate('click');
    expect(wrapper.find('.qrSection')).to.not.have.className('hide');
    expect(wrapper.find('.formSection .footerContent')).to.have.className('hide');
    wrapper.find('.qrSection .footerActionable').simulate('click');
    expect(wrapper.find('.qrSection')).to.have.className('hide');
    expect(wrapper.find('.formSection .footerContent')).to.not.have.className('hide');
  });

  describe('Amount field', () => {
    it('Should show converter on correct input', () => {
      const evt = { target: { name: 'amount', value: 1 } };
      let amountField = wrapper.find('.fieldGroup').at(0);
      expect(amountField).to.not.have.descendants('.converted-price');
      amountField.find('InputV2').simulate('change', evt);
      wrapper.update();
      amountField = wrapper.find('.fieldGroup').at(0);
      expect(amountField).to.have.descendants('.converted-price');
    });

    it('Should add leading 0 if . is inserted as first character', () => {
      const evt = { target: { name: 'amount', value: '.1' } };
      const input = wrapper.find('.fieldGroup').at(0).find('InputV2');
      input.simulate('change', evt);
      wrapper.update();
      expect(input).to.have.attr('value', '0.1');
    });

    it('Should show error feedback if letters inserted', () => {
      const evt = { target: { name: 'amount', value: 'abc' } };
      const amountField = wrapper.find('.fieldGroup').at(0);
      expect(amountField.find('.feedback')).to.not.have.className('error');
      amountField.find('InputV2').simulate('change', evt);
      wrapper.update();
      expect(amountField.find('.feedback')).to.have.className('error');
    });

    it('Should show error feedback if ending in . or multiples .', () => {
      const evt = { target: { name: 'amount', value: 1 } };
      const multipleDotsEvt = { target: { name: 'amount', value: '1.2.3' } };
      const endingDotEvt = { target: { name: 'amount', value: '12.' } };
      const amountField = wrapper.find('.fieldGroup').at(0);
      amountField.find('InputV2').simulate('change', endingDotEvt);
      wrapper.update();
      expect(amountField.find('.feedback')).to.have.className('error');
      amountField.find('InputV2').simulate('change', evt);
      wrapper.update();
      expect(amountField.find('.feedback')).to.not.have.className('error');
      amountField.find('InputV2').simulate('change', multipleDotsEvt);
      wrapper.update();
      expect(amountField.find('.feedback')).to.have.className('error');
    });
  });

  describe('Reference field', () => {
    it('Should show feedback if some text inserted and hide if empty', () => {
      const referenceField = wrapper.find('.fieldGroup').at(1);
      let evt = { target: { name: 'reference', value: 'test' } };
      expect(referenceField.find('.feedback')).to.not.have.className('show');
      referenceField.find('AutoresizeTextarea').simulate('change', evt);
      wrapper.update();
      expect(referenceField.find('.feedback')).to.have.className('show');
      expect(referenceField.find('.feedback')).to.not.have.className('error');

      evt = { target: { name: 'reference', value: '' } };
      referenceField.find('AutoresizeTextarea').simulate('change', evt);
      wrapper.update();
      expect(referenceField.find('.feedback')).to.not.have.className('show');
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
      expect(referenceField.find('.feedback')).to.have.className('show');
      expect(referenceField.find('.feedback')).to.have.className('error');
    });
  });

  describe('Share Link', () => {
    it('Should update share link with amount and reference', () => {
      const linkField = wrapper.find('.fieldGroup').at(2);
      const shareLink = `lisk://wallet/send?recipient=${props.address}`;
      let evt;
      expect(linkField.find(AutoresizeTextarea).html()).to.contain(shareLink);

      evt = { target: { name: 'reference', value: 'test' } };
      wrapper.find('.fieldGroup').at(1).find('AutoresizeTextarea').simulate('change', evt);
      expect(linkField.find(AutoresizeTextarea).html()).to.contain(`${evt.target.name}=${evt.target.value}`);

      evt = { target: { name: 'amount', value: 1 } };
      wrapper.find('.fieldGroup').at(0).find('InputV2').simulate('change', evt);
      expect(linkField.find(AutoresizeTextarea).html()).to.contain(`${evt.target.name}=${evt.target.value}`);
    });

    it('Should copy and set timeout on click', () => {
      const clock = useFakeTimers({
        now: new Date(2018, 1, 1),
        toFake: ['setTimeout', 'clearTimeout'],
      });

      expect(wrapper.find('CopyToClipboard button')).to.not.be.disabled();
      wrapper.find('CopyToClipboard').simulate('click');
      expect(wrapper.find('CopyToClipboard button')).to.be.disabled();
      clock.tick(3000);
      expect(wrapper.find('CopyToClipboard button')).to.not.be.disabled();

      clock.restore();
    });
  });
});
