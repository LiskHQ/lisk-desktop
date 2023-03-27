import React from 'react';
import { mountWithRouter, mountWithCustomRouter } from 'src/utils/testHelpers';
import { removeSearchParamsFromUrl } from 'src/utils/searchParams';
import Dialog from './dialog';

jest.mock('src/utils/searchParams', () => ({
  removeSearchParamsFromUrl: jest.fn(),
}));

const props = {
  history: {
    goBack: jest.fn(),
  },
};

describe('Dialog component', () => {
  afterEach(() => {
    removeSearchParamsFromUrl.mockClear();
    props.history.goBack.mockClear();
  });

  it('Should render without close button', () => {
    const Component = () => (
      <Dialog>
        <Dialog.Title>Dummy Title</Dialog.Title>
      </Dialog>
    );
    const wrapper = mountWithRouter(Component);
    expect(wrapper).not.toContainMatchingElement('.closeBtn');
    expect(wrapper).toContainExactlyOneMatchingElement(Dialog.Title);
  });

  it('Should render with close button and dismiss on click', () => {
    const Component = () => (
      <Dialog hasClose>
        <Dialog.Title>Dummy Title</Dialog.Title>
      </Dialog>
    );
    const wrapper = mountWithRouter(Component);
    wrapper.find('.closeBtn').simulate('click');
    expect(removeSearchParamsFromUrl).toBeCalledTimes(1);
  });

  it('Should render with back button and return to previous page on click', () => {
    const Component = () => (
      <Dialog hasBack>
        <Dialog.Title>Dummy Title</Dialog.Title>
      </Dialog>
    );
    const wrapper = mountWithCustomRouter(Component, props);
    wrapper.find('.backBtn').at(0).simulate('click');
    expect(props.history.goBack).toBeCalledTimes(1);
  });
});
