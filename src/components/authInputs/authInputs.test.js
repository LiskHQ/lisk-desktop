import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';
import { I18nextProvider } from 'react-i18next';

import accounts from '../../../test/constants/accounts';
import i18n from '../../i18n'; // initialized i18next instance
import AuthInputs from './authInputs';


describe('AuthInputs', () => {
  let wrapper;
  let props;
  const { passphrase } = accounts.delegate;

  beforeEach(() => {
    props = {
      onChange: sinon.spy(),
      secondPassphrase: { value: '' },
      account: {
        passphrase,
      },
      passphrase: {
        value: passphrase,
      },
      t: key => key,
    };
  });

  it('should render Input if props.account.secondSignature', () => {
    props.account.secondSignature = true;
    wrapper = mount(<I18nextProvider i18n={ i18n }><AuthInputs {...props} /></I18nextProvider>);
    expect(wrapper.find('Input')).to.have.lengthOf(1);
  });

  it('should render null if !props.account.secondSignature', () => {
    props.account.secondSignature = false;
    wrapper = mount(<I18nextProvider i18n={ i18n }><AuthInputs {...props} /></I18nextProvider>);
    expect(wrapper.html()).to.equal('<span></span>');
  });

  it('should render null if !props.account.secondSignature', () => {
    props.account.secondSignature = false;
    wrapper = mount(<I18nextProvider i18n={ i18n }><AuthInputs {...props} /></I18nextProvider>);
    expect(wrapper.html()).to.equal('<span></span>');
  });

  it('should call props.onChange when input value changes', () => {
    props.account.secondSignature = true;
    wrapper = mount(<I18nextProvider i18n={ i18n }><AuthInputs {...props} /></I18nextProvider>);
    wrapper.find('.second-passphrase input').first().simulate('change', { target: { value: passphrase } });
    expect(props.onChange).to.have.been.calledWith('secondPassphrase', passphrase);
  });

  it('should call props.onChange with an error if entered secondPassphrase does not belong to secondPublicKey', () => {
    const error = 'Entered passphrase does not belong to the active account';
    props.account.secondSignature = true;
    props.account.secondPublicKey = 'fab9d261ea050b9e326d7e11587eccc343a20e64e29d8781b50fd06683cacc88';
    wrapper = mount(<I18nextProvider i18n={ i18n }><AuthInputs {...props} /></I18nextProvider>);
    wrapper.find('.second-passphrase input').first().simulate('change', { target: { value: passphrase } });
    expect(props.onChange).to.have.been.calledWith('secondPassphrase', passphrase, error);
  });

  it('should call props.onChange(\'secondPassphrase\', \'Required\') when input value changes to \'\'', () => {
    props.account.secondSignature = true;
    wrapper = mount(<I18nextProvider i18n={ i18n }><AuthInputs {...props} /></I18nextProvider>);
    wrapper.find('.second-passphrase input').first().simulate('change', { target: { value: '' } });
    expect(props.onChange).to.have.been.calledWith('secondPassphrase', '', 'Required');
  });

  it('should call props.onChange(\'secondPassphrase\', \'Invalid passphrase\') when input value changes to \'test\'', () => {
    props.account.secondSignature = true;
    wrapper = mount(<I18nextProvider i18n={ i18n }><AuthInputs {...props} /></I18nextProvider>);
    wrapper.find('.second-passphrase input').first().simulate('change', { target: { value: 'test' } });
    expect(props.onChange).to.have.been.calledWith('secondPassphrase', 'test', 'Passphrase should have 12 words, entered passphrase has 1');
  });
});
