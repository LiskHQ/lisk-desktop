import React from 'react';
import { mount } from 'enzyme';
import Blocks from './blocks';

describe('Blocks', () => {
  let wrapper;

  const props = {
    t: v => v,
    blocks: [
      {
        asset: {
          data: 'testing',
        },
        id: 123,
      },
    ],
    onSelectedRow: jest.fn(),
  };

  beforeEach(() => {
    wrapper = mount(<Blocks {...props} />);
  });

  it('should render blocks result', () => {
    expect(wrapper).toContainMatchingElement('.blocks');
    expect(wrapper).toContainMatchingElement('.blocks-header');
    expect(wrapper).toContainMatchingElement('.blocks-content');
    expect(wrapper).toContainMatchingElement('.search-block-row');
  });

  it('should call onClick function on selected row', () => {
    wrapper.find('.search-block-row').at(0).simulate('click');
    expect(props.onSelectedRow).toBeCalled();
  });
});
