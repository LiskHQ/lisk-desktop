import React from 'react';
import chai, { expect } from 'chai';
import { shallow } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import { Button } from 'react-toolbox/lib/button';
import styles from './header.css';
import Header from '../header/index';
import logo from '../../assets/images/LISK-nano.png';

chai.use(chaiEnzyme()); // Note the invocation at the end
describe('<Header />', () => {
  const wrapper = shallow(<Header />);
  it('renders two <Button /> components', () => {
    expect(wrapper.find(Button)).to.have.length(2);
  });
  it('image should have srouce of "logo"', () => {
    expect(wrapper.contains(<img className={styles.logo} src={logo} alt="logo" />))
      .to.be.equal(true);
  });
});
