import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';
import ConfirmVotes from './confirmVotes';

describe('ConfirmVotes', () => {
  let wrapper;
  const account = {
    passphrase: 'pass',
    publicKey: 'key',
    secondSignature: 0,
    balance: 10e8,
  };
  const delegates = [
    {
      address: 'address 1',
      username: 'username1',
      publicKey: 'sample_key',
      rank: 12,
    },
    {
      address: 'address 2',
      username: 'username2',
      publicKey: 'sample_key',
      rank: 23,
    },
  ];

  const votes = {
    username1: { confirmed: true, unconfirmed: true, publicKey: 'sample_key' },
  };
  const props = {
    passphrase: {
      value: 'giraffe laugh math dash chalk butter ghost report truck interest merry lens',
    },
    secondPassphrase: {
      value: 'giraffe laugh math dash chalk butter ghost report truck interest merry lens',
    },
    goToNextStep: sinon.spy(),
    t: key => key,
    prevStep: sinon.spy(),
    nextStep: sinon.spy(),
    updateList: sinon.spy(),
    votePlaced: (data) => {
      data.goToNextStep({ success: true });
    },
    votes,
    delegates,
    account,
  };

  beforeEach(() => {
    wrapper = mount(<ConfirmVotes {...props}></ConfirmVotes>);
  });

  it('should click to back button call prevStep', () => {
    wrapper.find('button.back').simulate('click');
    expect(props.prevStep).to.be.calledWith();
  });

  it('should click to confirm button call votePlaced with success equal to true', () => {
    wrapper.find('button.confirm').simulate('click');
    expect(props.nextStep).to.be.calledWith();
  });

  it('should drag slider checkbox call nextStep', () => {
    const clock = sinon.useFakeTimers({
      toFake: ['setTimeout', 'clearTimeout', 'Date'],
    });
    wrapper.find('.confirmSlider label').props().onMouseDown({ nativeEvent: { pageX: 870 } });
    // When I start dragging the arrow
    wrapper.find('.confirmSlider label').props().onMouseMove({ nativeEvent: { pageX: 870 } });

    // And I keep dragging a bit more
    wrapper.find('.confirmSlider label').props().onMouseMove({ nativeEvent: { pageX: 921 } });
    // When I then 'drop' the arrow
    wrapper.find('.confirmSlider label').props().onMouseLeave();
    wrapper.update();
    clock.tick(250);
    wrapper.update();
    expect(props.nextStep).to.be.calledWith();
    clock.restore();
  });

  it('should click to confirm button call votePlaced with success equal to false', () => {
    props.votePlaced = (data) => {
      data.goToNextStep({ success: false });
    };
    wrapper.setProps(props);
    wrapper.find('button.confirm').simulate('click');
    expect(props.nextStep).to.be.calledWith();
  });
});
