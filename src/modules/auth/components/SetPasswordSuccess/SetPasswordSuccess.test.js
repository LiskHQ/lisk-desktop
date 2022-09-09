import React from 'react';
import { mount } from 'enzyme';
import * as txUtils from '@transaction/utils/transaction';
import SetPasswordSuccess from './index';

describe('Setup password success and JSON download component', () => {
  const props = {
    onClose: jest.fn(),
    encryptedPhrase: {
      name: 'encrypted recovery phrase',
      phrase: 'encrypted_phrase',
    },
  };

  it('should render properly', () => {
    const wrapper = mount(<SetPasswordSuccess {...props} />);
    expect(wrapper).toContainMatchingElement('.container');
    expect(wrapper).toContainMatchingElement('.content');
    expect(wrapper).toContainMatchingElement('.subheader');
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
      'encrypted_secret_recovery_phrase'
    );
  });

  it('should close modal when continue button is clicked', () => {
    const wrapper = mount(<SetPasswordSuccess {...props} />);
    wrapper.find('.continueButton').at(0).simulate('click');
    expect(props.onClose).toHaveBeenCalledTimes(1);
  });
});
