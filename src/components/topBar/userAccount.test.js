import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';
import { MemoryRouter as Router } from 'react-router-dom';
import PropTypes from 'prop-types';
import i18n from '../../i18n';
import UserAccount from './userAccount';
import routes from '../../constants/routes';

describe('UserAccount', () => {
  let wrapper;

  const myProps = {
    account: {
      address: '12345L',
      balance: 120,
    },
    isDropdownEnable: false,
    onDropdownToggle: sinon.spy(),
    onLogout: sinon.spy(),
    setDropdownRef: () => {},
    t: val => val,
  };

  const history = {
    location: { pathname: routes.dashboard.path },
  };

  const myOptions = {
    context: {
      history, i18n, router: { route: history, history },
    },
    childContextTypes: {
      history: PropTypes.object.isRequired,
      i18n: PropTypes.object.isRequired,
      router: PropTypes.object.isRequired,
    },
  };

  const mountWithRouter = (node, options) => mount(<Router>{node}</Router>, options);

  beforeEach(() => {
    wrapper = mountWithRouter(<UserAccount {...myProps} />, myOptions);
  });

  it('renders <UserAccount /> component', () => {
    expect(wrapper.find('.user-account')).to.have.length(1);
  });

  it('renders correct address value', () => {
    expect(wrapper.find('.copy-title')).to.have.text('12345L');
  });

  it('called properly onDropdownToggle when user click it', () => {
    wrapper.find('.avatar').simulate('click');
    wrapper.update();
    expect(myProps.onDropdownToggle).to.have.been.calledWith();
  });

  it('called properly dropdown component', () => {
    myProps.isDropdownEnable = true;
    wrapper = mountWithRouter(<UserAccount {...myProps} />, myOptions);
    expect(wrapper.find('DropdownV2')).to.have.length(1);
    expect(wrapper.find('a.dropdownOption')).to.have.length(1);
    expect(wrapper.find('span.dropdownOption')).to.have.length(1);
  });

  it('called properly onLogout when user click it', () => {
    myProps.isDropdownEnable = true;
    wrapper = mountWithRouter(<UserAccount {...myProps} />, myOptions);
    wrapper.find('span.dropdownOption').simulate('click');
    wrapper.update();
    expect(myProps.onLogout).to.have.been.calledWith();
  });

  it('render no address as account has no address', () => {
    myProps.account = {};
    wrapper = mountWithRouter(<UserAccount {...myProps} />, myOptions);
    expect(wrapper.find('.copy-title')).to.have.text('');
  });
});
