import React from 'react';
import { render } from '@testing-library/react';
import LabeledValue from '.';

describe('LabeldValue', () => {
  let wrapper;
  const props = {
    label: 'label',
    children: 'children',
    className: 'class-name',
    'data-testId': 'label-wrapper',
  };

  it('should render properly', () => {
    wrapper = render(<LabeledValue {...props} />);

    expect(wrapper.getByText(props.label)).toBeTruthy();
    expect(wrapper.getByText(props.children)).toBeTruthy();
    expect(wrapper.getByTestId(props['data-testId'])).toBeTruthy();
  });
});
