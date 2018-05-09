import React from 'react';
// import { expect } from 'chai';
import { mount } from 'enzyme';
// import sinon from 'sinon';
import PassphraseCreation from './index';

describe('Passphrase Creation', () => {
  let wrapper;
  const events = {};
  const props = {
    t: key => key,
    prevStep: () => {},
    nextStep: () => {},
    agent: 'android',
  };

  beforeEach(() => {
    window.addEventListener = (name, event) => {
      events[name] = event;
    };
    wrapper = mount(<PassphraseCreation {...props} ><div></div></PassphraseCreation>);
  });

  it.only('gets triggered and generates the seed on device tilt', () => {
    wrapper.instance().addEventListener();
    events.devicemotion({ rotationRate: { alpha: 20, beta: 20 } });
    // from here on i had problems with mocking the time -> WIP
  });

  it.skip('gets triggered and generates the seed on mouse move', () => {
    wrapper.instance().addEventListener();
    events.devicemotion({ pageX: 5, pageY: 5 });
  });
});
