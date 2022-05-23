import React from 'react';
import { mount } from 'enzyme';
import { render, screen, fireEvent } from '@testing-library/react';
import UploadJSONInput from './index';

describe('Upload JSON input component', () => {
  const props = {
    label: '',
    value: null,
    error: '',
    onChange: jest.fn(),
  };

  it('renders properly', () => {
    const wrapper = mount(<UploadJSONInput {...props} />);
    expect(wrapper).toContainMatchingElement('.fileInputLabel');
    expect(wrapper).toContainMatchingElement('.fileInputBtn');
    expect(wrapper).toContainMatchingElement('.clickableFileInput');
    expect(wrapper).toContainMatchingElement('.textAreaContainer');
  });

  it('should paste if JSON valid', () => {
    const wrapper = mount(<UploadJSONInput {...props} />);
    const inputField = wrapper.find('.tx-sign-input').first();
    const JSONObject = {};
    const clipboardData = {
      getData: () => JSON.stringify(JSONObject),
    };

    inputField.simulate('paste', { clipboardData });
    expect(props.onChange).toBeCalledWith(expect.objectContaining(JSONObject));
  });

  it('should return error if there is an error', () => {
    const wrapper = mount(<UploadJSONInput {...props} />);
    wrapper.setProps({ error: 'invalid JSON' });
    expect(wrapper.find('.feedback').text()).toEqual('invalid JSON');
  });

  it('should have default onChange function', () => {
    const newProps = {
      label: '',
      value: null,
      error: '',
    };
    const wrapper = mount(<UploadJSONInput {...newProps} />);
    const inputField = wrapper.find('.tx-sign-input').first();
    const JSONObject = {};
    const clipboardData = {
      getData: () => JSON.stringify(JSONObject),
    };

    inputField.simulate('paste', { clipboardData });
    expect(props.onChange).toBeCalledWith(expect.objectContaining(JSONObject));
  });

  it('should display the value if it is an initially fed', () => {
    const wrapper = mount(<UploadJSONInput {...props} />);
    const newProps = { error: false, value: { title: 'sample' } };
    wrapper.setProps(newProps);
    expect(wrapper.find('div > div').hasClass('filled')).toEqual(true);
    expect(wrapper.find('textarea').text()).toEqual(JSON.stringify(newProps.value));
  });

  it('should read the file and fill the textarea', async () => {
    const fileContents = "{ title: 'sample' }";
    const fileName = 'file.json';
    const file = new File([fileContents], fileName, { type: 'test/json' });

    render(<UploadJSONInput {...props} />);

    const inputNode = screen.getByRole('button');
    fireEvent.change(inputNode, { target: { files: [file] } });

    expect(inputNode.files[0].name).toBe(fileName);
    expect(inputNode.files.length).toBe(1);
  });
});
