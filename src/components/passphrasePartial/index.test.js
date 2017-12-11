import React from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
import { mount } from 'enzyme';
import i18n from '../../i18n';
import PassphrasePartial from './index';

describe('PassphrasePartial', () => {
  let wrapper;
  let props;
  const preventDefaultSpy = spy();

  beforeEach('', () => {
    props = {
      className: 'passphrase',
      value: [],
      index: 0,
      onChange: spy(),
      i18n,
    };
    wrapper = mount(<PassphrasePartial {...props} />);
  });

  it('should call props.onChange on change and update the parent value', () => {
    expect(wrapper.props().value).to.have.length(0);

    const passphrasePartial = 'wagon';
    wrapper.find('input').first().simulate('change', { target: { value: passphrasePartial } });

    expect(wrapper.props().onChange).to.have.been.calledWith(passphrasePartial);
    expect(wrapper.props().value).to.have.length(1);
    expect(wrapper.props().value[0]).to.equal(passphrasePartial);
  });


  it('should split the passphrase in partials on paste event and then paste them into each field', () => {
    expect(wrapper.props().value).to.have.length(0);

    const passphrase = 'wagon stock borrow episode laundry kitten salute link globe zero feed marble';
    wrapper.find('input').first().simulate('paste', {
      clipboardData: {
        getData: () => (passphrase),
      },
      preventDefault: preventDefaultSpy,
    });

    expect(preventDefaultSpy).to.have.been.calledWith();
    expect(wrapper.props().value).to.have.length(12);
    expect(wrapper.props().value).to.eql(passphrase.split(' '));
    expect(wrapper.find('input').instance().value).to.equal('wagon');
    preventDefaultSpy.reset();
  });

  it('should jump to next input field on space press', () => {
    const passphrasePartial = 'wagon';
    wrapper.find('input').simulate('change', { target: { value: passphrasePartial } });
    wrapper.find('input').simulate('keyPress', { key: 'spacebar', which: 32, keyCode: 32, preventDefault: preventDefaultSpy });
    expect(preventDefaultSpy).to.have.been.calledWith();
    preventDefaultSpy.reset();
  });
});
