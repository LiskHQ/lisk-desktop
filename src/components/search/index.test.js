import React from 'react';
import { spy } from 'sinon';
import { expect } from 'chai';
import keyCodes from './../../constants/keyCodes';
import * as keyAction from './keyAction';
import { mountWithContext } from './../../../test/utils/mountHelpers';
import Search from './index';

describe('Search Component', () => {
  let wrapper;
  let props;
  let visitSpy;

  beforeEach(() => {
    visitSpy = spy(keyAction, 'visitAndSaveSearchOnEnter');
    props = {
      history: { push: spy() },
      t: key => key,
    };
    wrapper = mountWithContext(<Search {...props} />, {});
  });

  it('performs a search', () => {
    expect(wrapper.find('input').props().value).to.equal('');
    wrapper.find('input').simulate('change', { target: { value: '1234567L' } });
    expect(wrapper.find('input').props().value).to.equal('1234567L');
    wrapper.find('input').simulate('keyUp', {
      keyCode: keyCodes.enter,
      which: keyCodes.enter,
      target: { value: '1234567L' },
    });
    expect(visitSpy).to.have.been.calledWith();
  });
});
