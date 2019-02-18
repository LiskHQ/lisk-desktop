import React from 'react';
import PropTypes from 'prop-types';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { spy } from 'sinon';
import configureMockStore from 'redux-mock-store';
import { MemoryRouter } from 'react-router-dom';
import i18n from '../../i18n';
import SplashScreen from './splashscreen';
import accounts from '../../../test/constants/accounts';
import routes from '../../constants/routes';

describe('V2 SplashScreen', () => {
  let wrapper;

  const peers = {
    data: {},
    options: {},
  };

  const history = {
    location: {
      pathname: '',
      search: '',
    },
    push: spy(),
    replace: spy(),
  };

  const account = accounts.genesis;

  const settings = {
    isTermsOfUse: false,
  };

  const store = configureMockStore([])({
    peers,
    account,
    settings,
  });

  const options = {
    context: { store, i18n, history },
    childContextTypes: {
      store: PropTypes.object.isRequired,
      i18n: PropTypes.object.isRequired,
      history: PropTypes.object.isRequired,
    },
  };

  const props = {
    peers,
    account,
    history,
    settings,
  };

  beforeEach(() => {
    wrapper = mount(<MemoryRouter><SplashScreen {...props} /></MemoryRouter>, options);
  });

  it('Should render all links, Sign in, Create an Account and Explre as Guest', () => {
    const buttons = wrapper.find('.wrapper').children('.button');
    expect(buttons.at(0).text()).to.equal('Sign in');
    expect(buttons.at(1).text()).to.equal('Create an Account');
    expect(wrapper.find('.link').at(0).text()).to.equal('Explore as a Guest');
  });

  describe('History management', () => {
    it('calls this.props.history.replace(\'/dashboard\')', () => {
      wrapper.setProps({
        history,
        children: React.cloneElement(wrapper.props().children, {
          account: { address: 'dummy' },
        }),
      });
      expect(props.history.replace).to.have.been.calledWith(`${routes.dashboard.path}`);
    });

    it('calls this.props.history.replace with referrer address', () => {
      props.history.replace.reset();
      history.location.search = `?referrer=${routes.delegates.path}`;
      wrapper.setProps({
        children: React.cloneElement(wrapper.props().children, {
          history, account: { address: 'dummy' },
        }),
      });
      expect(props.history.replace).to.have.been.calledWith(`${routes.delegates.path}`);
    });
  });

  describe('Terms of Use', () => {
    props.settings.isTermsOfUse = true;

    beforeEach(() => {
      wrapper = mount(<MemoryRouter><SplashScreen {...props} /></MemoryRouter>, options);
    });

    it('redirect to terms of use page', () => {
      expect(props.history.push).to.have.been.calledWith(`${routes.termsOfUse.path}`);
    });
  });
});
