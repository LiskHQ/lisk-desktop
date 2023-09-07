import { mount } from 'enzyme';
import React from 'react';
import wallets from '@tests/constants/wallets';
import MemberField from './MemberField';

const props = {
  t: (str) => str,
  index: 1,
  publicKey: wallets.genesis.summary.publicKey,
  isMandatory: true,
  showDeleteIcon: false,
  onChangeMember: jest.fn(),
  onDeleteMember: jest.fn(),
};

describe('MemberField', () => {
  it('displays member category as mandatory by default', () => {
    const wrapper = mount(<MemberField {...props} />);
    expect(wrapper.find('.mandatory-toggle').first()).toHaveText('Mandatory');
  });

  it('changes member category to optional', () => {
    const wrapper = mount(<MemberField {...props} />);
    wrapper
      .find('.select-optional-input')
      .simulate('change', { target: { checked: true, value: 'optional' } });
    const expectedObj = { index: props.index, publicKey: props.publicKey, isMandatory: false };
    expect(props.onChangeMember).toHaveBeenCalledWith(expectedObj);
  });

  it('can change optional member to mandatory', () => {
    const updatedProps = {
      ...props,
      isMandatory: false,
    };
    const wrapper = mount(<MemberField {...updatedProps} />);
    wrapper
      .find('.select-mandatory-input')
      .simulate('change', { target: { checked: true, value: 'mandatory' } });
    const expectedObj = { index: props.index, publicKey: props.publicKey, isMandatory: true };
    expect(props.onChangeMember).toHaveBeenCalledWith(expectedObj);
  });
});
