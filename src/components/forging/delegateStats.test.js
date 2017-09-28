import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n';
import DelegateStats from './delegateStats';


describe('DelegateStats', () => {
  const delegate = {
    username: 'genesis_17',
    rate: 19,
    approval: 30,
    productivity: 99.2,
  };
  let wrapper;

  beforeEach(() => {
    wrapper = mount(<I18nextProvider i18n={ i18n }>
      <DelegateStats delegate={delegate} />
    </I18nextProvider>);
  });

  it('should render 3 Card components', () => {
    expect(wrapper.find('Card')).to.have.lengthOf(3);
  });

  it('should render 3 CircularProgressbar components', () => {
    expect(wrapper.find('svg.CircularProgressbar')).to.have.lengthOf(3);
  });
});
