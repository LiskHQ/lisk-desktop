import React from 'react';
import { mount } from 'enzyme';
import Delegates from './delegates';

describe('Delegates', () => {
  let wrapper;

  const props = {
    t: v => v,
    delegates: [],
    onSelectedRow: jest.fn(),
  };

  beforeEach(() => {
    wrapper = mount(<Delegates {...props} />);
  });

  it('should render properly empty accounts', () => {
    expect(wrapper).toContainMatchingElement('.delegates');
    expect(wrapper).toContainMatchingElement('.delegates-header');
    expect(wrapper).toContainMatchingElement('.delegates-subtitle');
    expect(wrapper).toContainMatchingElement('.delegates-content');
    expect(wrapper).not.toContainMatchingElement('.delegates-row');
  });

  it('should render properly with accounts data', () => {
    const newProps = { ...props };
    newProps.delegates = [
      {
        account: {
          address: '123456L',
        },
        username: 'John',
        rank: 34,
        rewards: 23423,
        vote: 123,
      },
    ];
    wrapper = mount(<Delegates {...newProps} />);

    expect(wrapper).toContainMatchingElement('.delegates');
    expect(wrapper).toContainMatchingElement('.delegates-header');
    expect(wrapper).toContainMatchingElement('.delegates-subtitle');
    expect(wrapper).toContainMatchingElement('.delegates-content');
    expect(wrapper).toContainMatchingElement('.delegates-row');
  });

  it('should call onClick function on selected row', () => {
    const newProps = { ...props };
    newProps.delegates = [
      {
        account: {
          address: '123456L',
        },
        username: 'John',
        rank: 34,
        rewards: 23423,
        vote: 123,
      },
    ];
    wrapper = mount(<Delegates {...newProps} />);

    wrapper.find('.delegates-row').at(0).simulate('click');
    expect(props.onSelectedRow).toBeCalled();
  });
});
