import React from 'react';
import { expect } from 'chai';
import { mount, shallow } from 'enzyme';
import VoteRowV2 from './voteRowV2';

describe('VoteRowV2', () => {
  const downVoteStatus = { confirmed: true, unconfirmed: false, publicKey: 'sample_key' };
  const upVoteStatus = { confirmed: false, unconfirmed: true, publicKey: 'sample_key' };
  const props = {
    data: { rank: 1, productivity: 99, address: '1000001L' },
    className: 'custom-class-name',
    username: 'username1',
  };

  it('should have a list item with class name of "downVoteRow" when unconfirmed is false', () => {
    const downVoteProps = { ...props, data: { ...props.data, ...downVoteStatus } };
    const wrapper = mount(<VoteRowV2 {...downVoteProps} />);
    const expectedClass = 'downVoteRow';
    const className = wrapper.find('ul').prop('className');
    expect(className).to.contain(expectedClass);
  });

  it('should have a list item with class name of "upVoteRow" when unconfirmed is true', () => {
    const upVoteProps = { ...props, data: { ...props.data, ...upVoteStatus } };
    const wrapper = mount(<VoteRowV2 {...upVoteProps} />);
    const expectedClass = 'upVoteRow';
    const className = wrapper.find('ul').prop('className');
    expect(className).to.contain(expectedClass);
  });

  it('should not re-render if voteStatus has not been changed', () => {
    const oldProps = { ...props, data: { ...props.data, ...downVoteStatus } };
    const newProps = { ...props, data: { ...props.data, ...downVoteStatus } };
    const wrapper = shallow(<VoteRowV2 {...oldProps} />);
    const shouldUpdate = wrapper.instance()
      .shouldComponentUpdate(newProps);
    expect(shouldUpdate).to.be.equal(false);
  });
});

