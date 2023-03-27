import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { spy } from 'sinon';
import routes from 'src/routes/routes';
import TermsOfUse from './termsOfUse';

describe('TermsOfUse', () => {
  let wrapper;

  const history = {
    push: spy(),
  };

  const settings = {
    areTermsOfUseAccepted: false,
  };

  const props = {
    history,
    settings,
    t: (v) => v,
    settingsUpdated: spy(),
  };

  beforeEach(() => {
    wrapper = mount(<TermsOfUse {...props} />);
  });

  it('Should render properly terms of use component', () => {
    expect(wrapper.find('.wrapper')).to.have.length(1);
    expect(wrapper.find('.header')).to.have.length(1);
    expect(wrapper.find('.content')).to.have.length(1);
    wrapper.find('a').at(0).simulate('click');
  });

  it('click on accept terms and conditions', () => {
    wrapper.find('.accept-terms').at(0).simulate('click');
    expect(props.settingsUpdated).to.have.been.calledWith({ areTermsOfUseAccepted: true });
  });

  it('should redirect if isTermsOfUse is set to true', () => {
    wrapper.setProps({
      settings: { areTermsOfUseAccepted: true },
    });
    wrapper.update();
    expect(props.history.push).to.have.been.calledWith(`${routes.manageAccounts.path}`);
  });
});
