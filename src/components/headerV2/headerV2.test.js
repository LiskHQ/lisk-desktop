import React from 'react';
import PropTypes from 'prop-types';
import { spy } from 'sinon';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import i18n from '../../i18n';
import HeaderV2 from './headerV2';

describe('V2 Header', () => {
  let wrapper;
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
    handleNetworkSelect: spy(),
  };

  beforeEach(() => {
    wrapper = mount(<MemoryRouter>
      <HeaderV2 {...props} />
    </MemoryRouter>, options);
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
    const { networkList, handleNetworkSelect } = props;
    const randomNetwork = Math.floor(Math.random() * networkList.length);
    expect(wrapper.find('.dropdownHandler')).to.be.present();
    wrapper.find('.dropdownHandler').simulate('click');
    expect(wrapper.find('DropdownV2')).to.have.prop('showDropdown', true);
    wrapper.find('DropdownV2 .optionsHolder').children().at(randomNetwork).simulate('click');
    expect(handleNetworkSelect).to.have.been.calledWith(networkList[randomNetwork].value);
    expect(wrapper.find('DropdownV2')).to.have.prop('showDropdown', false);
  });
});
