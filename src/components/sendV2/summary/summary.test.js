import React from 'react';
import { mount } from 'enzyme';
import PropTypes from 'prop-types';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import i18n from '../../../i18n';
import Summary from './summary';

describe('Form', () => {
  let wrapper;

  const store = configureMockStore([thunk])({
    settings: { currency: 'USD' },
    settingsUpdated: () => {},
    liskService: {
      success: true,
      LSK: {
        USD: 1,
      },
    },
    followedAccounts: [
      {
        title: 'ABC',
        address: '12345L',
        balance: 10,
      },
      {
        title: 'FRG',
        address: '12375L',
        balance: 15,
      },
      {
        title: 'KTG',
        address: '12395L',
        balance: 7,
      },
    ],
  });

  const options = {
    context: { i18n, store },
    childContextTypes: {
      i18n: PropTypes.object.isRequired,
      store: PropTypes.object.isRequired,
    },
  };

  const props = {
    t: v => v,
    account: {
      secondPublicKey: 'ec057d8816b18b83a2baac387eebf8af707f8fb565c963476a0e4533e8481eaf',
    },
    fields: {
      recipient: {
        address: '123123L',
      },
      amount: {
        value: 1,
      },
      reference: {
        value: 1,
      },
    },
    prevState: {
      fields: {},
    },
    prevStep: jest.fn(),
    nextStep: jest.fn(),
  };

  beforeEach(() => {
    wrapper = mount(<Summary {...props} />, options);
  });

  it('should render properly', () => {
    expect(wrapper).toContainMatchingElement('.summary');
    expect(wrapper).toContainMatchingElement('.summary-header');
    expect(wrapper).toContainMatchingElement('.summary-content');
    expect(wrapper).toContainMatchingElement('.summary-footer');
    expect(wrapper).toContainMatchingElement('.summary-second-passphrase');
  });

  it('should goind to previous page', () => {
    wrapper.find('.on-prevStep').at(0).simulate('click');
    wrapper.update();
    expect(props.prevStep).toBeCalled();
  });

  it('should goind to next page if everyting is successfull', () => {
    const clipboardData = {
      getData: () => 'forest around decrease farm vanish permit hotel clay senior matter endorse domain',
    };
    wrapper.find('passphraseInputV2 input').first().simulate('paste', { clipboardData });
    wrapper.update();
    wrapper.find('.on-nextStep').at(0).simulate('click');
    wrapper.update();
    expect(props.nextStep).toBeCalled();
  });
});
