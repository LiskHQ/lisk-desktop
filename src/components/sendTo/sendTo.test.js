import React from 'react';
import { expect } from 'chai';
import { mountWithContext } from './../../../test/utils/mountHelpers';
import SendTo from './index';
import routes from './../../constants/routes';

describe('SendTo Component', () => {
  let wrapper;
  let props;
  const eventStorage = {};

  beforeEach(() => {
    window.addEventListener = (key, callback) => { eventStorage[key] = callback; };
    props = {
      address: '12345L',
      balance: 0,
      t: key => key,
    };
    wrapper = mountWithContext(<SendTo {...props} />, {});
  });

  it('renders correct link', () => {
    expect(wrapper.find('Link').prop('to')).to.equal(`${routes.wallet.long}?address=${props.address}`);
  });

  it('resizes the avatar based on the window size', () => {
    // set mobile size
    window.innerWidth = 1023;
    eventStorage.resize();
    wrapper.update();
    expect(wrapper.find('AccountVisual').prop('size')).to.equal(90);

    // set desktop sizeka
    window.innerWidth = 1024;
    eventStorage.resize();
    wrapper.update();
    expect(wrapper.find('AccountVisual').prop('size')).to.equal(144);
  });
});
