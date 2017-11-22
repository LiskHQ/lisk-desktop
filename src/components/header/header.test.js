import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import PropTypes from 'prop-types';
import sinon from 'sinon';
import { Button } from '../toolbox/buttons/button';
import Header from './header';
import RelativeLink from '../relativeLink';
import i18n from '../../i18n';

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
      t: key => key,
    };
    propsMock = sinon.mock(mockInputProps);
    wrapper = shallow(<Header {...mockInputProps} />, {
      context: { store, i18n },
      childContextTypes: {
        i18n: PropTypes.object.isRequired,
      },
    });
  });

  afterEach(() => {
    propsMock.verify();
    propsMock.restore();
  });

  it('renders 1 Button components', () => {
    expect(wrapper.find(Button)).to.have.length(1);
  });

  it('renders 10 RelativeLink components', () => {
    expect(wrapper.find(RelativeLink)).to.have.length(10);
  });
});
