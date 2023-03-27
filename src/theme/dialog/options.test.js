import React from 'react';
import { mountWithRouter } from 'src/utils/testHelpers';
import { removeSearchParamsFromUrl } from 'src/utils/searchParams';
import Options from './options';
import { PrimaryButton } from '../buttons';

jest.mock('src/utils/searchParams', () => ({
  removeSearchParamsFromUrl: jest.fn(),
}));

describe('Dialog.Options component', () => {
  afterEach(() => {
    removeSearchParamsFromUrl.mockClear();
  });

  it('Should render with single option, clicking option calls DialogHolder.hideDialog', () => {
    const Component = () => (
      <Options>
        <PrimaryButton>Option</PrimaryButton>
      </Options>
    );
    const wrapper = mountWithRouter(Component);
    expect(wrapper).toContainExactlyOneMatchingElement('button');
    wrapper.find('button').simulate('click');

    expect(removeSearchParamsFromUrl).toBeCalledTimes(1);
  });

  it('Should render multiple options calls DialogHolder.hideDialog even if onClick is set', () => {
    const onClick = jest.fn();
    const Component = () => (
      <Options align="center">
        <PrimaryButton>Option</PrimaryButton>
        <PrimaryButton onClick={onClick}>Option2</PrimaryButton>
      </Options>
    );

    const wrapper = mountWithRouter(Component);
    expect(wrapper.find('div')).toHaveClassName('center');
    expect(wrapper).toContainMatchingElements(2, 'button');
    wrapper.find('button').last().simulate('click');
    expect(onClick).toBeCalled();
    expect(removeSearchParamsFromUrl).toBeCalledTimes(1);
  });
});
