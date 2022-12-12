import React from 'react';
import { mount } from 'enzyme';
import Validators from './validators';

describe('Validators', () => {
  let wrapper;

  const props = {
    t: v => v,
    delegates: [],
    onSelectedRow: jest.fn(),
    rowItemIndex: 0,
    updateRowItemIndex: jest.fn(),
  };

  beforeEach(() => {
    wrapper = mount(<Validators {...props} />);
  });

  it('should render properly empty accounts', () => {
    expect(wrapper).toContainMatchingElement('.delegates');
    expect(wrapper).toContainMatchingElement('.delegates-header');
    expect(wrapper).toContainMatchingElement('.delegates-content');
    expect(wrapper).not.toContainMatchingElement('.delegates-row');
  });

  it('should render properly with accounts data', () => {
    const newProps = { ...props };
    newProps.delegates = [
      {
        summary: {
          address: '123456L',
        },
        dpos: {
          delegate: {
            username: 'John',
            rank: 34,
            rewards: 23423,
            vote: 123,
          },
        },
      },
      {
        summary: {
          address: '123457L',
        },
        dpos: {
          delegate: {
            username: 'Anna',
            rank: 26,
            rewards: 23421,
            vote: 127,
          },
        },
      },
    ];
    wrapper = mount(<Validators {...newProps} />);

    expect(wrapper).toContainMatchingElement('.delegates');
    expect(wrapper).toContainMatchingElement('.delegates-header');
    expect(wrapper).toContainMatchingElement('.delegates-content');
    expect(wrapper).toContainMatchingElement('.delegates-row');
  });

  it('should call onClick function on selected row', () => {
    const newProps = { ...props };
    newProps.delegates = [
      {
        summary: {
          address: '123456L',
        },
        dpos: {
          delegate: {
            username: 'John',
            rank: 34,
            rewards: 23423,
            vote: 123,
          },
        },
      },
    ];
    wrapper = mount(<Validators {...newProps} />);

    wrapper.find('.delegates-row').at(0).simulate('click');
    expect(props.onSelectedRow).toBeCalled();
  });
});
