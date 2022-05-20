import React from 'react';
import { mount } from 'enzyme';
import UploadJSONInput from './index';

describe('Upload JSON input component', () => {
  let wrapper;
  const props = {
    label: '',
    value: null,
    error: '',
    onChange: jest.fn(),
  };

  let inputField;

  beforeEach(() => {
    wrapper = mount(<UploadJSONInput {...props} />);
    inputField = wrapper.find('.tx-sign-input').first();
  });

  it('renders properly', () => {
    expect(wrapper).toContainMatchingElement('.fileInputLabel');
    expect(wrapper).toContainMatchingElement('.fileInputBtn');
    expect(wrapper).toContainMatchingElement('.clickableFileInput');
    expect(wrapper).toContainMatchingElement('.textAreaContainer');
  });

  it('should paste if JSON valid', () => {
    const JSONObject = {};
    const clipboardData = {
      getData: () => JSON.stringify(JSONObject),
    };

    inputField.simulate('paste', { clipboardData });
    expect(props.onChange).toBeCalledWith(expect.objectContaining(JSONObject));
  });

  it('should return error if there is an error', () => {
    wrapper.setProps({ error: 'invalid JSON' });
    expect(wrapper.find('.feedback').text()).toEqual('invalid JSON');
  });
});
