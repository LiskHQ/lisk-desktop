import React from 'react';
import { expect } from 'chai';
import { spy, useFakeTimers } from 'sinon';
import { mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import PropTypes from 'prop-types';
import accounts from '../../../test/constants/accounts';
import i18n from '../../i18n';
import SendWritable from './send';

const fakeStore = configureStore();

describe('Send Writable Component', () => {
  let wrapper;
  let props;
  // const clock = useFakeTimers({
  //   toFake: ['setTimeout', 'clearTimeout', 'Date', 'setInterval'],
  // });

  beforeEach(() => {
    const account = accounts.delegate;

    const store = fakeStore({
      account,
      settings: {},
      settingsUpdated: () => {},
    });

    props = {
      account,
      pendingTransactions: [],
      closeDialog: () => {},
      t: key => key,
      nextStep: () => {},
      history: { location: { search: '' } },
      followedAccounts: { accounts: [{ address: '123L', title: 'test' }] },
    };
    wrapper = mount(<SendWritable {...props} />, {
      context: { store, i18n },
      childContextTypes: {
        store: PropTypes.object.isRequired,
        i18n: PropTypes.object.isRequired,
      },
    });
  });

  afterEach(() => {
    // clock.restore();
  })

  it('renders three Input components', () => {
    expect(wrapper.find('Input')).to.have.length(3);
  });

  it('renders one Button component', () => {
    expect(wrapper.find('Button')).to.have.length(1);
  });

  it('accepts valid amount', () => {
    wrapper.find('.amount input').simulate('change', { target: { value: '120.25' } });
    expect(wrapper.find('Input.amount').text()).to.not.contain('Invalid amount');
  });

  it('recognizes invalid amount', () => {
    wrapper.find('.amount input').simulate('change', { target: { value: '120 INVALID' } });
    expect(wrapper.find('Input.amount').text()).to.contain('Invalid amount');
  });

  it('recognizes zero amount', () => {
    wrapper.find('.amount input').simulate('change', { target: { value: '0' } });
    expect(wrapper.find('Input.amount').text()).to.contain('Zero not allowed');
  });

  it('recognizes too high amount', () => {
    wrapper.find('.amount input').simulate('change', { target: { value: '12000' } });
    expect(wrapper.find('Input.amount').text()).to.contain('Not enough LSK');
  });

  it('recognizes empty amount', () => {
    wrapper.find('.amount input').simulate('change', { target: { value: '12000' } });
    wrapper.find('.amount input').simulate('change', { target: { value: '' } });
    expect(wrapper.find('Input.amount').text()).to.contain('Required');
  });

  it('accepts valid recipient', () => {
    wrapper.find('.recipient input').simulate('change', { target: { value: '11004588490103196952L' } });
    expect(wrapper.find('Input.recipient').text()).to.not.contain('Invalid address');
  });

  it('recognizes invalid recipient', () => {
    wrapper.find('.recipient input').simulate('change', { target: { value: '11004588490103196952' } });
    expect(wrapper.find('Input.recipient').text()).to.contain('Invalid address');
  });

  it('recognizes too big reference length', () => {
    wrapper.find('.reference input').simulate('change', { target: { value: 'test'.repeat(100) } });
    expect(wrapper.find('Input.reference').text()).to.contain('Maximum length exceeded');
  });

  it('displays bookmark', () => {
    const account = accounts.delegate;
    const followedAccounts = { accounts: [{ address: '123L', title: '123' }] };

    const store = fakeStore({
      account,
      settings: {},
      settingsUpdated: () => {},
      followedAccounts,
    });
    props.followedAccounts = followedAccounts.accounts;
    wrapper = mount(<SendWritable {...props} />, {
      context: { store, i18n },
      childContextTypes: {
        store: PropTypes.object.isRequired,
        i18n: PropTypes.object.isRequired,
      },
    });

    expect(wrapper.find('Bookmark')).to.have.length(1);
  });

  it('Shows the Set max. amount link on amount focus', () => {
    // const handleFocusSpy = spy(wrapper.instance(), 'handleFocus');
    wrapper.find('.amount input').simulate('focus');
    const component = wrapper.instance();
    expect(wrapper.state('showSetMaxAmount')).to.equal(true);

    // console.log(component.handleFocus.toString());
    /* eslint-disable no-unused-expressions */
    // expect(handleFocusSpy).to.have.been.calledOnce;
    /* eslint-enable no-unused-expressions */
    // expect(wrapper.find('Input.amount').text()).to.contain('Required');
  });


  it('Puts max amount into input field', () => {
    wrapper.find('.amount input').simulate('focus');
    wrapper.find('.set-max-amount').simulate('click');
    expect(wrapper.state('amount').value).to.equal(999.9);
  });

  // it('Shows the Set max. amount link on amount focus', () => {
  //   wrapper.find('.amount input').simulate('focus');
  //   expect(wrapper.state('showSetMaxAmount')).to.equal(true);
  //   wrapper.find('.amount input').simulate('blur');
  //   clock.tick(1200);
  //   expect(wrapper.state('showSetMaxAmount')).to.equal(false);
  // });

  // it('shold set max. amount', () => {
  //   const storeWithCurrency = fakeStore({
  //     settings: { currency: 'USD' },
  //     settingsUpdated: () => {},
  //   });

  //   const props = {
  //     t: key => key,
  //     value: '',
  //     error: false,
  //     currency: 'USD',
  //     onSetMaxAmount: sinon.spy(),
  //   };

  //   wrapper = mountWithContext(
  //     <Converter {...props} store={storeWithCurrency}/>,
  //     { storeState: storeWithCurrency },
  //   );

  //   wrapper.find('.set-max-amount').simulate('click');
  //   /* eslint-disable no-unused-expressions */
  //   expect(props.onSetMaxAmount).to.have.been.calledOnce;
  //   /* eslint-enable no-unused-expressions */
  // });
});
