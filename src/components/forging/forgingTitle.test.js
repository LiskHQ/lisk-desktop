import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n';
import ForgingTitle from './forgingTitle';


describe('ForgingTitle', () => {
  const account = {
    delegate: {
      username: 'genesis_17',
      rate: 19,
      approval: 30,
      productivity: 99.2,
    },
  };
  const statistics = {
    total: 132423,
  };
  const loadStats = () => {};
  let wrapper;

  beforeEach(() => {
    wrapper = mount(<I18nextProvider i18n={ i18n }>
      <ForgingTitle
        account={account} statistics={statistics} loadStats={loadStats}/>
    </I18nextProvider>);
  });

  it('should render 1 Card component', () => {
    expect(wrapper.find('Card')).to.have.lengthOf(1);
  });

  it('should render h2 with delegate name', () => {
    expect(wrapper.find('h2').text()).to.equal(account.delegate.username);
  });
});
