import React from 'react';
import { expect } from 'chai';
import { mount, shallow } from 'enzyme';
import VoteRow from './voteRow';

describe('VoteRow', () => {
  const downVoteStatus = { confirmed: true, unconfirmed: false, publicKey: 'sample_key' };
  const upVoteStatus = { confirmed: false, unconfirmed: true, publicKey: 'sample_key' };
  const props = {
    data: { rank: 1, productivity: 99, address: '1000001L' },
    className: 'custom-class-name',
    username: 'username1',
  };

  it('should have a list item with class name of "downVoteRow" when unconfirmed is false', () => {
    const downVoteProps = Object.assign({}, props, { data: { ...props.data, ...downVoteStatus } });
    const wrapper = mount(<VoteRow {...downVoteProps} />);
    const expectedClass = 'downVoteRow';
    const className = wrapper.find('ul').prop('className');
    expect(className).to.contain(expectedClass);
  });

  it('should have a list item with class name of "upVoteRow" when unconfirmed is true', () => {
    const upVoteProps = Object.assign({}, props, { data: { ...props.data, ...upVoteStatus } });
    const wrapper = mount(<VoteRow {...upVoteProps} />);
    const expectedClass = 'upVoteRow';
    const className = wrapper.find('ul').prop('className');
    expect(className).to.contain(expectedClass);
  });

  it('should not re-render if voteStatus has not been changed', () => {
    const oldProps = Object.assign({}, props, { data: { ...props.data, ...downVoteStatus } });
    const newProps = Object.assign({}, props, { data: { ...props.data, ...downVoteStatus } });
    const wrapper = shallow(<VoteRow {...oldProps} />);
    const shouldUpdate = wrapper.instance()
      .shouldComponentUpdate(newProps);
    expect(shouldUpdate).to.be.equal(false);
  });
});

