import React from 'react';
import { mount } from 'enzyme';
import Validators from './validators';

describe('Validators', () => {
  let wrapper;

  const props = {
    t: (v) => v,
    validators: [],
    onSelectedRow: jest.fn(),
    rowItemIndex: 0,
    updateRowItemIndex: jest.fn(),
  };

  beforeEach(() => {
    wrapper = mount(<Validators {...props} />);
  });

  it('should render properly empty accounts', () => {
    expect(wrapper).toContainMatchingElement('.validators');
    expect(wrapper).toContainMatchingElement('.validators-header');
    expect(wrapper).toContainMatchingElement('.validators-content');
    expect(wrapper).not.toContainMatchingElement('.validators-row');
  });

  it('should render properly with accounts data', () => {
    const newProps = { ...props };
    newProps.validators = [
      {
        summary: {
          address: '123456L',
        },
        pos: {
          validator: {
            username: 'John',
            rank: 34,
            rewards: 23423,
            stake: 123,
          },
        },
      },
      {
        summary: {
          address: '123457L',
        },
        pos: {
          validator: {
            username: 'Anna',
            rank: 26,
            rewards: 23421,
            stake: 127,
          },
        },
      },
    ];
    wrapper = mount(<Validators {...newProps} />);

    expect(wrapper).toContainMatchingElement('.validators');
    expect(wrapper).toContainMatchingElement('.validators-header');
    expect(wrapper).toContainMatchingElement('.validators-content');
    expect(wrapper).toContainMatchingElement('.validators-row');
  });

  it('should call onClick function on selected row', () => {
    const newProps = { ...props };
    newProps.validators = [
      {
        summary: {
          address: '123456L',
        },
        pos: {
          validator: {
            username: 'John',
            rank: 34,
            rewards: 23423,
            stake: 123,
          },
        },
      },
    ];
    wrapper = mount(<Validators {...newProps} />);

    wrapper.find('.validators-row').at(0).simulate('click');
    expect(props.onSelectedRow).toBeCalled();
  });
});
