import React from 'react';
import { useFakeTimers } from 'sinon';
import { mount } from 'enzyme';
import ConfirmPassphrase from './confirmPassphrase';

describe('Register Process - Confirm Passphrase', () => {
  let wrapper;
  let clock;

  const props = {
    passphrase: 'barely feature filter inmate exotic sister dog boil crush build canvas latin',
  };

  const selectWrongWords = (comp) => {
    comp.find('div.option').forEach(option =>
      !props.passphrase.includes(option.text) && option.simulate('click'));
  };
  beforeEach(() => {
    wrapper = mount(<ConfirmPassphrase {...props} />);
    clock = useFakeTimers({
      now: new Date(2018, 1, 1),
      toFake: ['setTimeout', 'clearTimeout', 'Date', 'setInterval'],
    });
  });

  afterEach(() => {
    clock.restore();
  });

  it('Should handle selection', () => {
    wrapper.find('.passphraseContainer');
    wrapper.find('.emptyWord').at(0).simulate('click');
    selectWrongWords(wrapper);
    expect(wrapper.find('.selected')).toExist();
    wrapper.find('.emptyWord').at(0).simulate('click');
    selectWrongWords(wrapper);
    wrapper.find('.buttonsHolder Button').at(1).simulate('click');
    expect(wrapper.find('.error')).toExist();
  });

  it('Should update empty values after wrong selection', () => {
    wrapper.find('.passphraseContainer');
    wrapper.find('.emptyWord').at(0).simulate('click');
    selectWrongWords(wrapper);
    wrapper.find('.emptyWord').at(0).simulate('click');
    selectWrongWords(wrapper);
    wrapper.find('.buttonsHolder Button').at(1).simulate('click');
    clock.tick(1500);
    wrapper.update();
    expect(wrapper.find('.emptyWord')).toExist();
  });
});
