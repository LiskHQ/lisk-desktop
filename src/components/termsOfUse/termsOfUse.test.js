import React from 'react';
import PropTypes from 'prop-types';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { spy } from 'sinon';
import configureMockStore from 'redux-mock-store';
import i18n from '../../i18n';
import TermsOfUse from './termsOfUse';
import routes from '../../constants/routes';

describe('TermsOfUse', () => {
  let wrapper;

  const history = {
    push: spy(),
  };

  const settings = {
    isTermsOfUse: false,
  };

  const store = configureMockStore([])({
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
    history,
    settings,
    t: v => v,
    settingsUpdated: spy(),
  };

  beforeEach(() => {
    wrapper = mount(<TermsOfUse {...props} />, options);
  });

  it('Should render properly terms of use component', () => {
    expect(wrapper.find('.wrapper')).to.have.length(1);
    expect(wrapper.find('.header')).to.have.length(1);
    expect(wrapper.find('.content')).to.have.length(1);
    wrapper.find('a').at(0).simulate('click');
  });

  it('click on accept terms and conditions', () => {
    wrapper.find('.accept-terms').at(0).simulate('click');
    expect(props.settingsUpdated).to.have.been.calledWith({ isTermsOfUse: false });
  });

  it('should redirect if isTermsOfUse is set to true', () => {
    wrapper.setProps({
      settings: { isTermsOfUse: true },
    });
    wrapper.update();
    expect(props.history.push).to.have.been.calledWith(`${routes.splashscreen.path}`);
  });
});
