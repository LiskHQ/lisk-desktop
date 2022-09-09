import React from 'react';
import { spy, useFakeTimers } from 'sinon';
import { expect } from 'chai';
import { mountWithContext } from '@tests/unit-test-utils/mountHelpers';
import Header from './index';

describe.skip('Signin Header', () => {
  let wrapper;
  let clock;

  const props = {
    showSettings: true,
    showNetwork: true,
    selectedNetwork: 0,
    networkList: [
      { label: 'Mainnet', value: 0 },
      { label: 'Testnet', value: 1 },
      { label: 'Custom Node', value: 2 },
    ],
    settings: {
      token: {
        active: 'LSK',
      },
    },
    account: {
      address: '123456L',
      info: {
        LSK: {
          address: '123456L',
          balance: 100,
        },
      },
    },
    history: {
      push: spy(),
    },
    settingsUpdated: spy(),
    liskAPIClientSet: spy(),
  };

  beforeEach(() => {
    clock = useFakeTimers({
      toFake: ['setTimeout', 'clearTimeout'],
    });

    wrapper = mountWithContext(<Header {...props} />);
  });

  afterEach(() => {
    clock.restore();
  });

  it('Should render Logo, Settings Button and Network Switcher dropdown', () => {
    expect(wrapper.find('.logo')).to.be.present();
    expect(wrapper.find('.settingButton')).to.be.present();
    expect(wrapper.find('.dropdownHandler')).to.be.present();
  });

  it('Should not render Network switcher dropdown and Settings Button', () => {
    wrapper.setProps({
      children: React.cloneElement(wrapper.props().children, {
        showSettings: false,
        showNetwork: false,
      }),
    });
    expect(wrapper.find('.dropdownHandler')).to.not.be.present();
    expect(wrapper.find('.settingButton')).to.not.be.present();
  });

  it('Should open dropdown on Network switcher click and close and call handler on option click', () => {
    const { networkList } = props;
    expect(wrapper.find('.dropdownHandler')).to.be.present();
    wrapper.find('.dropdownHandler').simulate('click');
    expect(wrapper.find('Dropdown')).to.have.prop('showDropdown', true);
    wrapper
      .find('Dropdown .dropdown-content')
      .children()
      .at(networkList[0].value)
      .simulate('click');
    expect(wrapper.find('Dropdown')).to.have.prop('showDropdown', false);
  });

  it('Should open dropdown on Network switcher click and show Connect button', () => {
    const { networkList } = props;
    expect(wrapper.find('.dropdownHandler')).to.be.present();
    wrapper.find('.dropdownHandler').simulate('click');
    expect(wrapper.find('Dropdown')).to.have.prop('showDropdown', true);
    wrapper
      .find('Dropdown .dropdown-content')
      .children()
      .at(networkList[2].value)
      .simulate('click');
    wrapper
      .find('.custom-network')
      .first()
      .simulate('change', { target: { value: 'localhost:4000' } });

    expect(wrapper).to.have.descendants('.connect-button');
  });

  it('Should open dropdown on Network switcher click and show Connect button', () => {
    const { networkList } = props;
    expect(wrapper.find('.dropdownHandler')).to.be.present();
    wrapper.find('.dropdownHandler').simulate('click');
    expect(wrapper.find('Dropdown')).to.have.prop('showDropdown', true);
    wrapper
      .find('Dropdown .dropdown-content')
      .children()
      .at(networkList[2].value)
      .simulate('click');
    wrapper
      .find('.custom-network')
      .first()
      .simulate('change', { target: { value: 'localhost:4000' } });

    expect(wrapper).to.have.descendants('.connect-button');
  });
});
