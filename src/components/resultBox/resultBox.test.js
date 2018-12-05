import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { spy } from 'sinon';
import PropTypes from 'prop-types';
import { FontIcon } from '../fontIcon';
import ResultBox from './resultBox';
import styles from './resultBox.css';
import i18n from '../../i18n';

describe('Result Box', () => {
  let wrapper;
  let props;

  const options = {
    context: { i18n },
    childContextTypes: {
      i18n: PropTypes.object.isRequired,
    },
  };

  it('renders result box with success template', () => {
    const title = 'Thank you';
    const body = 'Transaction is being processed and will be confirmed. It may take up to 15 minutes to be secured in the blockchain.';
    const copy = {
      title: 'Copy Transaction-ID to clipboard',
      value: '1234',
    };
    props = {
      copy,
      account: {},
      title,
      body,
      success: true,
      reset: spy(),
      copyToClipboard: () => {},
      finalCallback: () => {},
      transactionFailedClear: () => {},
      t: () => {},
      history: { location: {}, push: () => {}, replace: () => {} },
      followedAccounts: [],
    };

    wrapper = mount(<ResultBox {...props} />, options);

    expect(wrapper.find('h2').text()).to.contain(title);
    expect(wrapper.find('.result-box-message').text()).to.contain(body);
    expect(wrapper.find(`.${styles.header}`).find(FontIcon)).to.be.not.present();
    expect(wrapper.find('img')).to.have.length(1);
    expect(wrapper.find('.copy-title').text()).to.contain(copy.title);

    wrapper.find('.okay-button').first().simulate('click');
    expect(props.reset).to.have.been.calledWith();
  });

  it('renders result box with failure template', () => {
    const title = 'Sorry';
    const body = 'An error occurred while creating the transaction.';
    props = {
      copy: null,
      title,
      account: {},
      body,
      success: false,
      reset: () => {},
      copyToClipboard: () => {},
      t: () => {},
      followedAccounts: [],
    };

    wrapper = mount(<ResultBox {...props} />, options);

    expect(wrapper.find('h2').text()).to.contain(title);
    expect(wrapper.find('.result-box-message').text()).to.contain(body);
    expect(wrapper.find(`.${styles.header}`).find(FontIcon)).to.be.present();
    expect(wrapper.find('img')).to.have.length(0);
    expect(wrapper.find('.copy-title')).to.have.length(0);
  });

  it('calls props.onMount if it is a function', () => {
    props = {
      copy: null,
      title: 'Sorry',
      body: 'An error occurred while creating the transaction.',
      success: false,
      reset: () => {},
      copyToClipboard: () => {},
      t: () => {},
      onMount: spy(),
      followedAccounts: [],
      account: {},
    };

    wrapper = mount(<ResultBox {...props} />, options);

    expect(props.onMount).to.have.been.calledWith(true, 'ResultBox');
  });

  it('display add follwed account button', () => {
    props = {
      copy: null,
      title: 'Sorry',
      body: 'An error occurred while creating the transaction.',
      success: false,
      reset: () => {},
      copyToClipboard: () => {},
      t: () => {},
      onMount: spy(),
      reciepientId: '123L',
      followedAccounts: [{
        address: '1L',
      }],
      account: {
        hwInfo: {},
      },
    };

    wrapper = mount(<ResultBox {...props} />, options);

    expect(wrapper).to.have.descendants('.add-to-bookmarks');
  });
});
