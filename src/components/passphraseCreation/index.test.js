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
      expect(wrapper.find(CreateFirst)).to.have.prop('percentage').at.least(100);
      expect(wrapper.find(CreateFirst)).to.have.prop('hintTitle', 'by moving your mouse.');
      expect(wrapper.find(CreateFirst)).to.have.prop('address');
      expect(wrapper.find(CreateFirst)).to.have.prop('step', 'info');
      expect(wrapper.find(CreateFirst)).to.have.prop('passphrase', accounts.genesis.passphrase);
    });
  });
});
