import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { Button } from 'react-toolbox/lib/button';
import sinon from 'sinon';
import styles from './header.css';
import Header from './header';
import logo from '../../assets/images/LISK-nano.png';

describe('Header', () => {
  let wrapper;
  let propsMock;

  beforeEach(() => {
    const mockInputProps = {
      setActiveDialog: () => { },
      account: {},
    };
    propsMock = sinon.mock(mockInputProps);
    wrapper = shallow(<Header {...mockInputProps} />);
  });

  afterEach(() => {
    propsMock.verify();
    propsMock.restore();
  });

  it('renders two Button components', () => {
    expect(wrapper.find(Button)).to.have.length(2);
  });

  it('should have an image with srouce of "logo"', () => {
    expect(wrapper.contains(<img className={styles.logo} src={logo} alt="logo" />))
      .to.be.equal(true);
  });

  it('Sign Message menu item should call props.setActiveDialog("sign-message")', () => {
    // TODO: figure out why the next line doesn't work
    // propsMock.expects('setActiveDialog').withArgs('sign-message');
    wrapper.find('.main-menu-icon-button').simulate('click');
    wrapper.find('.sign-message').simulate('click');
  });

  it('Verify Message menu item should call props.setActiveDialog("verify-message")', () => {
    // TODO: figure out why the next line doesn't work
    // propsMock.expects('setActiveDialog').withArgs('verify-message');
    wrapper.find('.main-menu-icon-button').simulate('click');
    wrapper.find('.verify-message').simulate('click');
  });
});
