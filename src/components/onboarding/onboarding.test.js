import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { spy, match } from 'sinon';
import Joyride from 'react-joyride';
import { Onboarding } from './index';
import breakpoints from './../../constants/breakpoints';

describe('Onboarding Component', () => {
  let wrapper;
  let joyrideNext;
  let joyrideReset;
  let joyrideComponentWillReceiveProps;
  const props = {
    t: key => key,
    onRef: () => {},
    appLoaded: true,
    isAuthenticated: true,
    showDelegates: false,
    start: true,
    settingsUpdated: () => true,
  };

  describe('Without advanced settings', () => {
    beforeEach(() => {
      joyrideComponentWillReceiveProps = spy(Joyride.prototype, 'componentWillReceiveProps');
      joyrideReset = spy(Joyride.prototype, 'reset');
      joyrideNext = spy(Joyride.prototype, 'next');
      wrapper = mount(<Onboarding {...props} />);
    });

    afterEach(() => {
      joyrideComponentWillReceiveProps.restore();
      joyrideReset.restore();
      joyrideNext.restore();
    });

    it('adds steps and does not start the onboarding when on mobile', () => {
      expect(joyrideComponentWillReceiveProps).to.have.been.calledWith(match({ run: false }));
      expect(joyrideComponentWillReceiveProps.getCall(0).args[0].steps.length).to.equal(9);
    });

    it('goes through the onboarding', () => {
      expect(joyrideNext).to.not.have.been.calledWith();
      wrapper.find(Joyride).props().callback({ index: 0 });
      expect(joyrideNext).to.have.been.calledWith();

      wrapper.find(Joyride).props().callback({ index: 1 });

      expect(wrapper.state('intro')).to.equal(true);
      wrapper.find(Joyride).props().callback({ index: 2 });
      expect(wrapper.state('intro')).to.equal(false);

      expect(joyrideReset).to.not.have.been.calledWith();
      wrapper.find(Joyride).props().callback({ index: 8 });

      expect(wrapper.state('skip')).to.equal(false);
      expect(joyrideReset).to.not.have.been.calledWith();
      wrapper.find(Joyride).props().callback({ action: 'skip' });
      expect(wrapper.state('skip')).to.equal(true);
      expect(joyrideReset).to.have.been.calledWith();

      joyrideReset.reset();
      expect(joyrideReset).to.not.have.been.calledWith();
      wrapper.find(Joyride).props().callback({ type: 'finished' });
      expect(joyrideReset).to.have.been.calledWith();
    });

    it('should remove event listener on unmount', () => {
      spy(window, 'removeEventListener');
      expect(window.removeEventListener).to.not.have.been.calledWith();
      wrapper.unmount();
      expect(window.removeEventListener).to.have.been.calledWith('resize');
      window.removeEventListener.restore();
    });
  });

  describe('With advanced settings', () => {
    beforeEach(() => {
      joyrideComponentWillReceiveProps = spy(Joyride.prototype, 'componentWillReceiveProps');
    });

    afterEach(() => {
      joyrideComponentWillReceiveProps.restore();
    });

    it('does not run when not authenticated', () => {
      window.innerWidth = breakpoints.l;
      props.showDelegates = true;
      props.isAuthenticated = false;
      wrapper = mount(<Onboarding {...props} />);

      expect(joyrideComponentWillReceiveProps).to.have.been.calledWith(match({ run: false }));
    });

    it('does not add steps if app did not load yet', () => {
      window.innerWidth = breakpoints.l;
      props.showDelegates = true;
      props.appLoaded = false;
      props.isAuthenticated = true;
      wrapper = mount(<Onboarding {...props} />);

      expect(joyrideComponentWillReceiveProps).to.not.have.been.calledWith();
      wrapper.setProps({ appLoaded: true });
      expect(joyrideComponentWillReceiveProps).to.have.been.calledWith(match({ run: true }));
      expect(joyrideComponentWillReceiveProps.getCall(0).args[0].steps.length).to.equal(10);
    });
  });
});
