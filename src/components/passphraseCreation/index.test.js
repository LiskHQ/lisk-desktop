import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { stub, spy } from 'sinon';
import PassphraseCreation from './index';
import CreateFirst from './../passphrase/create/create';
import * as isMobile from '../../utils/isMobile';
import * as passphraseUtils from './../../utils/passphrase';
import accounts from './../../../test/constants/accounts';

describe('Passphrase Creation', () => {
  let wrapper;
  const events = {};
  const props = {
    t: key => key,
    prevStep: () => {},
    nextStep: () => {},
  };

  beforeEach(() => {
    window.addEventListener = (name, event) => {
      events[name] = event;
    };
    spy(passphraseUtils, 'generateSeed');
    stub(passphraseUtils, 'generatePassphrase').returns(accounts.genesis.passphrase);
  });

  afterEach(() => {
    passphraseUtils.generateSeed.restore();
    passphraseUtils.generatePassphrase.restore();
  });

  describe('Using laptop', () => {
    beforeEach(() => {
      stub(isMobile, 'default').returns(false);

      wrapper = mount(<PassphraseCreation {...props} >
        <CreateFirst t={() => {}}/>
      </PassphraseCreation>);
    });

    afterEach(() => {
      isMobile.default.restore();
    });

    it('sets the next step once the movement is completed', () => {
      expect(wrapper.find(CreateFirst)).to.have.prop('percentage', 0);
      expect(wrapper.find(CreateFirst)).to.have.prop('hintTitle', 'by moving your mouse.');
      expect(wrapper.find(CreateFirst)).to.have.prop('address', null);
      expect(wrapper.find(CreateFirst)).to.have.prop('step', 'generate');
      expect(wrapper.find(CreateFirst)).to.not.have.prop('passphrase');

      for (let i = 0; i < 250; i++) {
        events.mousemove({ pageX: 200 * (i % 2), pageY: 200 * (i % 2) });
      }

      wrapper.update();
      expect(wrapper.find(CreateFirst)).to.have.prop('percentage').greaterThan(100);
      expect(wrapper.find(CreateFirst)).to.have.prop('hintTitle', 'by moving your mouse.');
      expect(wrapper.find(CreateFirst)).to.have.prop('address');
      expect(wrapper.find(CreateFirst)).to.have.prop('step', 'info');
      expect(wrapper.find(CreateFirst)).to.have.prop('passphrase', accounts.genesis.passphrase);
    });
  });

  describe('Using mobile device', () => {
    beforeEach(() => {
      window.addEventListener = (name, event) => {
        events[name] = event;
      };
      stub(isMobile, 'default').returns(true);
    });

    afterEach(() => {
      isMobile.default.restore();
    });

    it('returns child element with correct properties', () => {
      wrapper = mount(<PassphraseCreation {...props} >
        <CreateFirst t={() => {}}/>
      </PassphraseCreation>);

      expect(wrapper.find(CreateFirst)).to.have.prop('percentage', 0);
      expect(wrapper.find(CreateFirst)).to.have.prop('hintTitle', 'by tilting your device.');
      expect(wrapper.find(CreateFirst)).to.have.prop('address', null);
      expect(wrapper.find(CreateFirst)).to.have.prop('step', 'generate');
      expect(wrapper.find(CreateFirst)).to.not.have.prop('passphrase');
    });

    it('gets triggered and generates the seed on device tilt', () => {
      wrapper = mount(<PassphraseCreation {...props} ><div></div></PassphraseCreation>);

      const date = new Date();
      const time = new Date(date.setSeconds(date.getSeconds() - 5));
      // fake time difference
      wrapper.instance().lastCaptured.time = time;
      wrapper.instance().addEventListener();

      // now tilt device without breaks
      for (let i = 0; i < 250; i++) {
        events.devicemotion({ rotationRate: { alpha: 200 * i, beta: 200 * i } });
      }

      expect(passphraseUtils.generateSeed).to.have.callCount(1);
      expect(passphraseUtils.generatePassphrase).to.not.have.been.calledWith();

      // now tilt device with breaks
      for (let i = 0; i < 250; i++) {
        // fake time difference
        wrapper.instance().lastCaptured.time = time;
        events.devicemotion({ rotationRate: { alpha: 200 * i, beta: 200 * i } });
      }

      expect(passphraseUtils.generateSeed.callCount).to.be.greaterThan(30);
      expect(passphraseUtils.generatePassphrase).to.have.been.calledWith();
    });
  });
});
