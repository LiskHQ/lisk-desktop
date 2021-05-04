import React from 'react';
import { mount } from 'enzyme';
import Editor from './editor';

describe('Multisignature editor component', () => {
  let wrapper;
  const props = {
    t: v => v,
    account: {

    },
    nextStep: jest.fn(),
  };

  beforeEach(() => {
    wrapper = mount(<Editor {...props} />);
  });

  it('renders properly', () => {
    expect(wrapper).toContainMatchingElement('header');
    expect(wrapper).toContainMatchingElement('ProgressBar');
    expect(wrapper).toContainMatchingElement('.multisignature-editor-input');
    expect(wrapper).toContainMatchingElement('.multisignature-members-controls');
    expect(wrapper).toContainMatchingElements(2, 'MemberField');
    expect(wrapper).toContainMatchingElement('TransactionPriority');
    expect(wrapper).toContainMatchingElement('footer');
  });

  it.skip('CTA is disabled when form is invalid', () => {
    expect(wrapper.find('.confirm-button').at(0)).toBeDisabled();
  });

  it('can add no more than 64 members', () => {
    for (let i = 0; i < 62; ++i) {
      wrapper.find('.add-new-members').at(0).simulate('click');
    }

    expect(wrapper).toContainMatchingElements(64, 'MemberField');
    expect(wrapper.find('.add-new-members').at(0)).toBeDisabled();
  });

  it('delete icon is only visible if required signatues < members.length', () => {
    expect(wrapper).not.toContainMatchingElement('.delete-icon');
    for (let i = 0; i < 3; ++i) {
      wrapper.find('.add-new-members').at(0).simulate('click');
    }
    expect(wrapper).toContainMatchingElements(5, '.delete-icon');
  });

  it('clicking delete icon deletes a member field', () => {
    wrapper.find('.add-new-members').at(0).simulate('click');
    wrapper.find('.delete-icon').at(0).simulate('click');
    expect(wrapper).toContainMatchingElements(2, 'MemberField');
  });

  it('props.nextStep is called when the CTA is clicked', () => {
    wrapper.find('.confirm-button').at(0).simulate('click');
    expect(props.nextStep).toHaveBeenCalledTimes(1);
  });
});
