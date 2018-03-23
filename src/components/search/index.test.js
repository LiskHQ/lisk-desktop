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
  let visitOnEnterSpy;
  const storage = {};

  beforeEach(() => {
    window.localStorage.getItem = key => (storage[key]);
    window.localStorage.setItem = (key, item) => { storage[key] = item; };

    visitOnEnterSpy = spy(keyAction, 'visitAndSaveSearchOnEnter');
    visitSpy = spy(keyAction, 'visitAndSaveSearch');

    props = {
      history: { push: spy() },
      t: key => key,
    };
    wrapper = mountWithContext(<Search {...props} />, {});
  });

  afterEach(() => {
    visitOnEnterSpy.restore();
    visitSpy.restore();
  });

  it('performs a search on enter', () => {
    expect(wrapper.find('input').props().value).to.equal('');
    wrapper.find('input').simulate('change', { target: { value: '1234567L' } });
    expect(wrapper.find('input').props().value).to.equal('1234567L');
    wrapper.find('input').simulate('keyUp', {
      keyCode: keyCodes.enter,
      which: keyCodes.enter,
      target: { value: '1234567L' },
    });
    expect(visitOnEnterSpy).to.have.been.calledWith();
  });

  it('performs a search by clicking the buttons', () => {
    wrapper.find('input').simulate('change', { target: { value: '123L' } });
    wrapper.find('#search-button').first().simulate('click');
    expect(visitSpy).to.have.been.calledWith('123L', props.history);
    visitSpy.reset();
    wrapper.find('input').simulate('change', { target: { value: '987L' } });
    wrapper.find('#input-search-button').first().simulate('click');
    expect(visitSpy).to.have.been.calledWith('987L', props.history);
  });
});
