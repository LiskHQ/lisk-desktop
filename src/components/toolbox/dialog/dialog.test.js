import React from 'react';
import { mountWithRouter, mountWithRouterAndStore } from '@utils/testHelpers';
import { removeSearchParamsFromUrl } from '@utils/searchParams';
import { secondPassphraseRemoved } from '@actions';
import Dialog from './dialog';

jest.mock('@utils/searchParams', () => ({
  removeSearchParamsFromUrl: jest.fn(),
}));

jest.mock('@actions', () => ({
  secondPassphraseRemoved: jest.fn(),
}));

describe('Dialog component', () => {
  afterEach(() => {
    removeSearchParamsFromUrl.mockClear();
    secondPassphraseRemoved.mockClear();
  });

  it('Should render without close button', () => {
    const Component = () => <Dialog><Dialog.Title>Dummy Title</Dialog.Title></Dialog>;
    const wrapper = mountWithRouter(Component);
    expect(wrapper).not.toContainMatchingElement('.closeBtn');
    expect(wrapper).toContainExactlyOneMatchingElement(Dialog.Title);
  });

  it('Should render with close button and dismiss on click', () => {
    const Component = () => <Dialog hasClose><Dialog.Title>Dummy Title</Dialog.Title></Dialog>;
    const wrapper = mountWithRouter(Component);
    wrapper.find('.closeBtn').simulate('click');
    expect(removeSearchParamsFromUrl).toBeCalledTimes(1);
  });

  it('Should render with close button, dismiss on click and remove second passphrase if it exists', () => {
    const Component = () => <Dialog hasClose><Dialog.Title>Dummy Title</Dialog.Title></Dialog>;
    const wrapper = mountWithRouterAndStore(Component, {}, {}, {
      account: {
        secondPassphrase: 'pen hawk chunk better gadget flat picture wait exclude zero hung broom',
      },
    });
    wrapper.find('.closeBtn').simulate('click');
    expect(secondPassphraseRemoved).toBeCalledTimes(1);
    expect(removeSearchParamsFromUrl).toBeCalledTimes(1);
  });
});
