import React from 'react';
import { mount } from 'enzyme';
import newReleaseUtil from './newRelease';
import FlashMessageHolder from '../components/toolbox/flashMessage/holder';
import DialogHolder from '../components/toolbox/dialog/holder';
import { toastDisplayed } from '../actions/toaster';
import store from '../store';

jest.mock('../store');

describe('new release util', () => {
  const callbacks = {};
  const ipc = {
    on: jest.fn((event, callback) => { callbacks[event] = callback; }),
    send: jest.fn(),
  };

  beforeEach(() => {
    ipc.send.mockClear();
    store.dispatch = jest.fn();
    window.ipc = ipc;
  });

  afterEach(() => {
    delete window.ipc;
    store.dispatch.mockRestore();
  });

  it('Should return undefined if no ipc on window', () => {
    delete window.ipc;
    expect(newReleaseUtil.init()).toEqual(undefined);
  });

  it('Should dispatch toaster when ipc receives update:downloading', () => {
    const expectedAction = { label: 'Download started!' };
    newReleaseUtil.init();
    callbacks['update:downloading']({}, expectedAction);
    expect(store.dispatch).toBeCalledWith(toastDisplayed(expectedAction));
  });

  it('Should call FlashMessageHolder.addMessage when ipc receives update:available', () => {
    const wrapper = mount(<FlashMessageHolder />);
    const dialogWrapper = mount(<DialogHolder />);
    const version = '1.20.1';
    const releaseNotes = '<h4>dummy text</h4><h3>Fixed bugs</h3>';
    expect(wrapper).toBeEmptyRender();
    expect(dialogWrapper).toBeEmptyRender();
    newReleaseUtil.init();
    expect(ipc.on).toHaveBeenCalled();
    callbacks['update:available']({}, { version, releaseNotes });
    wrapper.update();
    expect(wrapper).toIncludeText('dummy text');
    wrapper.find('button').simulate('click');
    dialogWrapper.update();
    expect(dialogWrapper).toIncludeText('dummy text');
  });
});
