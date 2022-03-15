import React from 'react';
import { mountWithRouter } from '@utils/testHelpers';
import { removeSearchParamsFromUrl } from '@utils/searchParams';
import Dialog from './dialog';

jest.mock('@utils/searchParams', () => ({
  removeSearchParamsFromUrl: jest.fn(),
}));

describe('Dialog component', () => {
  afterEach(() => {
    removeSearchParamsFromUrl.mockClear();
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
});
