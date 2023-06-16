import React from 'react';
import { mount } from 'enzyme';
import { render, screen, fireEvent, act, createEvent } from '@testing-library/react';
import UploadJSONInput from './index';

describe('Upload JSON input component', () => {
  const props = {
    label: 'Restore from JSON file',
    value: null,
    error: '',
    onChange: jest.fn(),
    onError: jest.fn(),
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

  it('should call onError if pasting invalid json', async () => {
    const wrapper = mount(<UploadJSONInput {...props} />);
    const inputField = wrapper.find('.tx-sign-input').first();
    const invalidJson = '{"result":true, "count":42';
    const clipboardData = {
      getData: () => invalidJson,
    };

    inputField.simulate('paste', { clipboardData });
    expect(props.onError).toHaveBeenCalled();
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

    const inputNode = screen.getByLabelText('Restore from JSON file');
    fireEvent.change(inputNode, { target: { files: [file] } });

    expect(inputNode.files[0].name).toBe(fileName);
    expect(inputNode.files.length).toBe(1);
  });

  it('should call onError if the uploaded file contains invalid json', async () => {
    jest.spyOn(global, 'FileReader').mockImplementation(function () {
      this.readAsText = jest.fn();
    });

    render(<UploadJSONInput {...props} />);

    const invalidJson = '{"result":true, "count":42';
    const file = new File([invalidJson], 'file.json', { type: 'application/json' });
    const inputNode = screen.getByLabelText('Restore from JSON file');

    await act(async () => {
      await fireEvent.change(inputNode, { target: { files: [file] } });

      const reader = FileReader.mock.instances[0];
      reader.onload({ target: { result: invalidJson } });
    });

    expect(props.onError).toHaveBeenCalled();
  });

  it('should open the file dialog only once on click', async () => {
    render(<UploadJSONInput {...props} />);

    const mockPreventDefault = jest.fn();
    const wrapperNode = screen.getByTestId('upload-json-wrapper');
    const clickEvent = createEvent.click(wrapperNode);
    Object.assign(clickEvent, { preventDefault: mockPreventDefault });
    await act(async () => {
      fireEvent(wrapperNode, clickEvent);
    });

    expect(mockPreventDefault).toHaveBeenCalledTimes(1);
  });
});
