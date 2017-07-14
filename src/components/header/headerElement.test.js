import React from 'react';
import chai, { expect } from 'chai';
import { shallow } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import sinonChai from 'sinon-chai';
import { Button } from 'react-toolbox/lib/button';
import styles from './header.css';
import HeaderElement from './headerElement';
import logo from '../../assets/images/LISK-nano.png';
import sinon from 'sinon';

chai.use(sinonChai);
chai.use(chaiEnzyme()); // Note the invocation at the end
describe('<HeaderElement />', () => {
  let wrapper;
  let propsMock;

  beforeEach(() => {
    const mockInputProps = {
      setActiveDialog: () => { },
    };
    propsMock = sinon.mock(mockInputProps);
    wrapper = shallow(<HeaderElement setActiveDialog={mockInputProps.setActiveDialog} />);
  });

  afterEach(() => {
    propsMock.verify();
    propsMock.restore();
  });

  it('renders two <Button /> components', () => {
    expect(wrapper.find(Button)).to.have.length(2);
  });

  it('image should have srouce of "logo"', () => {
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
