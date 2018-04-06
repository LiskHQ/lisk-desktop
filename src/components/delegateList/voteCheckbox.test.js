import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';
import VoteCheckbox from './voteCheckbox';
import styles from './delegateList.css';

describe('VoteCheckbox', () => {
  const props = {
    data: {
      username: 'yashar',
      publicKey: 'address 1',
    },
    styles,
    toggle: sinon.spy(),
  };
  const voteStatus = { confirmed: false, unconfirmed: true };
  const unvoteStatus = { confirmed: true, unconfirmed: false };
  const pendingStatus = { confirmed: true, unconfirmed: true, pending: true };

  describe('General', () => {
    let wrapper;
    beforeEach(() => {
      wrapper = mount(<VoteCheckbox {...props} status={ voteStatus } />);
    });

    it('should render an checkbox input', () => {
      expect(wrapper.find('input').exists()).to.be.equal(true);
    });

    it.skip('should input change event should call props.toggle', () => {
      wrapper.find('input').simulate('click');
      expect(props.toggle).to.have.been.calledWith(props.data);
    });
  });

  describe('To show vote', () => {
    it('should check the checkbox input', () => {
      const wrapper = mount(<VoteCheckbox {...props} status={ voteStatus } />);
      expect(wrapper.find('input').props().checked).to.equal(true);
    });
  });

  describe('To show unvote', () => {
    it('should uncheck the checkbox input', () => {
      const wrapper = mount(<VoteCheckbox {...props} status={ unvoteStatus } />);
      expect(wrapper.find('input').props().checked).to.equal(false);
    });

    it('should render a checkbox input even if status is not passed', () => {
      const wrapper = mount(<VoteCheckbox {...props} />);
      expect(wrapper.find('input').props().checked).to.equal(false);
    });
  });

  describe('To show pending', () => {
    it('should render a Spinner When pending is true', () => {
      const wrapper = mount(<VoteCheckbox {...props} status={ pendingStatus } />);
      expect(wrapper.find('Spinner').exists()).to.be.equal(true);
    });
  });
});
