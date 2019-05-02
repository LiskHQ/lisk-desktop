import React from 'react';
import PropTypes from 'prop-types';
import { spy, useFakeTimers } from 'sinon';
import { expect } from 'chai';
import { mountWithContext } from '../../../test/unit-test-utils/mountHelpers';
import i18n from '../../i18n';
import HeaderV2 from './index';
// import networks from '../../constants/networks';

describe.skip('V2 Header', () => {
  let wrapper;
  let clock;
  const options = {
    context: { i18n },
    childContextTypes: {
      i18n: PropTypes.object.isRequired,
    },
  };

  const props = {
    showSettings: true,
    showNetwork: true,
    selectedNetwork: 0,
    networkList: [
      { label: 'Mainnet', value: 0 },
      { label: 'Testnet', value: 1 },
      { label: 'Custom Node', value: 2 },
    ],

    settingsUpdated: spy(),
    liskAPIClientSet: spy(),
  };

  beforeEach(() => {
    clock = useFakeTimers({
      toFake: ['setTimeout', 'clearTimeout'],
    });

    wrapper = mountWithContext(<HeaderV2 {...props} />, options);
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
    expect(wrapper.find('DropdownV2')).to.have.prop('showDropdown', true);
    wrapper.find('DropdownV2 .dropdown-content').children().at(networkList[0].value).simulate('click');
    expect(wrapper.find('DropdownV2')).to.have.prop('showDropdown', false);
  });

  it('Should open dropdown on Network switcher click and show Connect button', () => {
    const { networkList } = props;
    expect(wrapper.find('.dropdownHandler')).to.be.present();
    wrapper.find('.dropdownHandler').simulate('click');
    expect(wrapper.find('DropdownV2')).to.have.prop('showDropdown', true);
    wrapper.find('DropdownV2 .dropdown-content').children().at(networkList[2].value).simulate('click');
    wrapper.find('.custom-network').first().simulate('change', { target: { value: 'localhost:4000' } });

    expect(wrapper).to.have.descendants('.connect-button');
  });

  it('Should open dropdown on Network switcher click and show Connect button', () => {
    const { networkList } = props;
    expect(wrapper.find('.dropdownHandler')).to.be.present();
    wrapper.find('.dropdownHandler').simulate('click');
    expect(wrapper.find('DropdownV2')).to.have.prop('showDropdown', true);
    wrapper.find('DropdownV2 .dropdown-content').children().at(networkList[2].value).simulate('click');
    wrapper.find('.custom-network').first().simulate('change', { target: { value: 'localhost:4000' } });

    expect(wrapper).to.have.descendants('.connect-button');
  });
});
