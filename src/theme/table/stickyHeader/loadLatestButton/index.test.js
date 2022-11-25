import { act } from 'react-dom/test-utils';
import React from 'react';
import { mount } from 'enzyme';
import { mockBlocks } from '@block/__fixtures__';
import { useLatestBlock } from '@block/hooks/queries/useLatestBlock';
import LoadLatestButton from '.';

jest.mock('@block/hooks/queries/useLatestBlock');

describe('LoadLatestButton', () => {
  const props = {
    onClick: jest.fn(),
    entity: 'block',
    children: 'Test load button',
  };

  useLatestBlock.mockReturnValue({ data: mockBlocks.data[0] });

  it('renders accept transaction and block for entity and render empty by default', () => {
    const blockProps = { ...props, entity: 'block' };
    let wrapper = mount(<LoadLatestButton {...blockProps} />);
    expect(wrapper).toBeEmptyRender();

    const transactionProps = { ...props, entity: 'transaction' };
    wrapper = mount(<LoadLatestButton {...transactionProps} />);
    expect(wrapper).toBeEmptyRender();
  });

  it('shows button when there is a new block', () => {
    const wrapper = mount(<LoadLatestButton {...props} />);
    expect(wrapper).toBeEmptyRender();
    act(() => {
      wrapper.update();
    });
    expect(wrapper).toContainExactlyOneMatchingElement('button');
    expect(wrapper).toHaveText(props.children);

    wrapper.find('button').at(0).simulate('click');
    expect(props.onClick).toHaveBeenCalledWith();
    act(() => {
      wrapper.update();
    });
    expect(wrapper).toBeEmptyRender();
  });
});
