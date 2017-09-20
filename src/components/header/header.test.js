import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import { Button } from 'react-toolbox/lib/button';
import sinon from 'sinon';
import styles from './header.css';
import Header from './header';
import RelativeLink from '../relativeLink';
import logo from '../../assets/images/LISK-nano.png';

describe('Header', () => {
  let wrapper;
  let propsMock;

  const store = configureMockStore([])({
    peers: { data: {} },
    account: {},
    activePeerSet: () => {},
  });

  beforeEach(() => {
    const mockInputProps = {
      setActiveDialog: () => { },
      account: {},
      t: t => t,
    };
    propsMock = sinon.mock(mockInputProps);
    wrapper = shallow(<Header {...mockInputProps} />, {
      context: { store },
      childContextTypes: {
      },
    });
  });

  afterEach(() => {
    propsMock.verify();
    propsMock.restore();
  });

  it('renders two Button components', () => {
    expect(wrapper.find(Button)).to.have.length(1);
  });

  it('renders two RelativeLink components', () => {
    expect(wrapper.find(RelativeLink)).to.have.length(6);
  });

  it('should have an image with srouce of "logo"', () => {
    expect(wrapper.contains(<img className={styles.logo} src={logo} alt="logo" />))
      .to.be.equal(true);
  });
});
