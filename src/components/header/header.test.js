import React from 'react';
import { expect } from 'chai';
import { MemoryRouter as Router } from 'react-router-dom';
import { mount } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import PropTypes from 'prop-types';
import sinon from 'sinon';
import Header from './header';
import i18n from '../../i18n';
import routes from '../../constants/routes';

describe('Header', () => {
  let wrapper;
  let propsMock;

  const mountWithRouter = (node, options) => mount(<Router>{node}</Router>, options);

  const store = configureMockStore([])({
    peers: { data: { options: {} } },
    account: {},
    activePeerSet: () => {},
  });

  beforeEach(() => {
    const mockInputProps = {
      setActiveDialog: () => { },
      resetTimer: sinon.spy(),
      account: {},
      t: key => key,
      location: { pathname: `${routes.explorer.path}${routes.search}` },
      isAuthenticated: false,
    };
    propsMock = sinon.mock(mockInputProps);
    wrapper = mountWithRouter(<Header {...mockInputProps} />, {
      context: { store, i18n },
      childContextTypes: {
        store: PropTypes.object.isRequired,
        i18n: PropTypes.object.isRequired,
      },
    });
  });

  afterEach(() => {
    propsMock.verify();
    propsMock.restore();
  });

  it('renders 1 Link component if not logged in', () => {
    expect(wrapper.find('Link')).to.have.length(1);
  });
});
