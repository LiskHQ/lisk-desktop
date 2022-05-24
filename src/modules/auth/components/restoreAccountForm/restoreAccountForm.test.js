import React from 'react';
import { mount } from 'enzyme';
import RestoreAccountForm from './index';

describe('Restore account form component', () => {
  let wrapper;
  const props = {
    onSubmit: jest.fn((value) => value),
  };

  beforeEach(() => {
    wrapper = mount(<RestoreAccountForm {...props} />);
  });

  it('should render properly', () => {
    expect(wrapper).toContainMatchingElement('.titleHolder');
    expect(wrapper).toContainMatchingElement('.fullWidth');
    expect(wrapper).toContainMatchingElement('.clickableFileInput');
    expect(wrapper).toContainMatchingElement('.textAreaContainer');
    expect(wrapper).toContainMatchingElement('.buttonHolder');
  });

  it('should call onSubmit when onContinue is clicked', () => {
    const JSONObject = {};
    const clipboardData = {
      getData: () => JSON.stringify(JSONObject),
    };

    wrapper.find('.tx-sign-input').first().simulate('paste', { clipboardData });
    wrapper.find('button').first().simulate('click');
    expect(props.onSubmit).toBeCalledWith(expect.objectContaining(JSONObject));
  });
});
