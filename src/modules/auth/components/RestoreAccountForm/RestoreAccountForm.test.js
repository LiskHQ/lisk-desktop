import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import RestoreAccountForm from '.';

describe('Restore account form component', () => {
  let wrapper;
  const props = {
    onSubmit: jest.fn((value) => value),
    nextStep: jest.fn(),
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

  it('should return error onSubmit if value is undefined', () => {
    wrapper.find('button').first().simulate('click');
    expect(props.onSubmit).not.toBeCalled();
  });

  it('should call onSubmit when onContinue is clicked', () => {
    const JSONObject = { crypto: { ciphertext: 'text' } };
    const clipboardData = {
      getData: () => JSON.stringify(JSONObject),
    };

    wrapper.find('.tx-sign-input').first().simulate('paste', { clipboardData });
    wrapper.find('button').first().simulate('click');
    const toExpect = { encryptedAccount: { ...JSONObject } };
    expect(props.nextStep).toBeCalledWith(expect.objectContaining(toExpect));
  });

  it('should display an error message if no file was uploaded', () => {
    wrapper.find('button').first().simulate('click');
    expect(wrapper.findWhere((node) => node.text() === 'Upload file is required')).toBeTruthy();
  });

  it('should show feedback error text when pasting invalid JSON', async () => {
    const invalidJson = '{"result":true, "count":42';
    const clipboardData = {
      getData: () => invalidJson,
    };
    wrapper.find('.tx-sign-input').first().simulate('paste', { clipboardData });
    expect(wrapper.find('.feedback').text()).toBeTruthy();
  });

  it('should show feedback error text when uploading incorrect JSON file', async () => {
    jest.spyOn(global, 'FileReader').mockImplementation(function () {
      this.readAsText = jest.fn();
    });
    const inputField = wrapper.find('UploadJSONInput').find('[role="button"]');
    const invalidJson = '{"crypto": {"notCipher": "something"}}';
    const file = new File([invalidJson], 'file.json', { type: 'test/json' });

    act(() => {
      inputField.simulate('change', { target: { files: [file] } });
      const reader = FileReader.mock.instances[0];
      reader.onload({ target: { result: invalidJson } });
    });
    expect(wrapper.find('.feedback').text()).toBeTruthy();
  });
});
