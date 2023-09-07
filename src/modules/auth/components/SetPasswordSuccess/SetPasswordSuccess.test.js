import React from 'react';
import { mount } from 'enzyme';
import * as txUtils from '@transaction/utils/transaction';
import SetPasswordSuccess from './index';

describe('Setup password success and JSON download component', () => {
  const address = 'lskdxc4ta5j43jp9ro3f8zqbxta9fn6jwzjucw7yt';
  const name = 'test_acct';
  const props = {
    onClose: jest.fn(),
    encryptedPhrase: {
      metadata: {
        name,
        address,
      },
    },
  };

  it('should render properly', () => {
    const wrapper = mount(<SetPasswordSuccess {...props} />);
    expect(wrapper).toContainMatchingElement('.container');
    expect(wrapper).toContainMatchingElement('.content');
    expect(wrapper).toContainMatchingElement('.subHeader');
    expect(wrapper).toContainMatchingElement('.downloadLisk');
    expect(wrapper).toContainMatchingElement('.downloadBtn');
    expect(wrapper).toContainMatchingElement('.continueButton');
  });

  it('should download JSON when download button is clicked', () => {
    const spyOnJSONDownload = jest.spyOn(txUtils, 'downloadJSON');
    const wrapper = mount(<SetPasswordSuccess {...props} />);
    wrapper.find('.downloadBtn').at(0).simulate('click');
    expect(spyOnJSONDownload).toHaveBeenCalledWith(
      props.encryptedPhrase,
      `${address}-${name}-lisk-account`
    );
  });

  it('should close modal when continue button is clicked', () => {
    const wrapper = mount(<SetPasswordSuccess {...props} />);
    wrapper.find('.continueButton').at(0).simulate('click');
    expect(props.onClose).toHaveBeenCalledTimes(1);
  });
});
