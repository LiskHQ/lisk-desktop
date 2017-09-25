import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n';
import ForgingStats from './forgingStats';


describe('ForgingStats', () => {
  const account = {
    delegate: {
      username: 'genesis_17',
      rate: 19,
      approval: 30,
      productivity: 99.2,
    },
  };
  const statistics = {
    last24h: 321317,
    last7d: 3213179124,
    last30d: 321317912423,
    last365d: 32131791242342,
  };
  const loadStats = () => {};
  let wrapper;

  beforeEach(() => {
    wrapper = mount(<I18nextProvider i18n={ i18n }>
      <ForgingStats
        account={account}
        statistics={statistics}
        loadStats={loadStats} />
    </I18nextProvider>);
  });

  it('should render 4 Card components', () => {
    expect(wrapper.find('Card')).to.have.lengthOf(4);
  });

  it('should render Card component for Last 24 hours', () => {
    expect(wrapper.find('Card').at(0).text().trim()).to.equal('Last 24 hours 0 LSK');
  });

  it('should render Card component for Last 7 days', () => {
    expect(wrapper.find('Card').at(1).text().trim()).to.equal('Last 7 days 32.13 LSK');
  });

  it('should render Card component for Last 30 days', () => {
    expect(wrapper.find('Card').at(2).text().trim()).to.equal('Last 30 days 3,213.18 LSK');
  });

  it('should render Card component for Last 365 days', () => {
    expect(wrapper.find('Card').at(3).text().trim()).to.equal('Last 365 days 321,317.91 LSK');
  });
});
