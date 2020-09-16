import { expect } from 'chai';
import Delegates from './index';
import { loginType } from '../../../constants/hwConstants';
import accounts from '../../../../test/constants/accounts';
import { mountWithRouter } from '../../../utils/testHelpers';

const delegates = [
  {
    address: 'address 1',
    username: 'username1',
    publicKey: 'sample_key',
    serverPublicKey: 'sample_key',
    rank: 12,
  },
  {
    address: 'address 2',
    username: 'username2',
    publicKey: 'sample_key',
    serverPublicKey: 'sample_key',
    rank: 23,
  },
];
const votes = {
  username1: { confirmed: true, unconfirmed: true, publicKey: 'sample_key' },
};
const mockStore = {
  network: {
    networks: {
      LSK: { apiVersion: '2' }, // @todo Remove?
    },
  },
  account: { address: delegates[0].address },
  voting: { votes, delegates: [] },
  history: {
    push: jest.fn(),
    location: {
      search: '',
    },
  },
};

describe('Delegates', () => {
  const defaultProps = {
    delegates,
    votes,
    t: key => key,
    onBoardingDiscarded: false,
    history: { location: { search: '' } },
    clearVotes: jest.fn(),
    loadDelegates: jest.fn(),
    loadVotes: jest.fn(),
  };

  it.skip('should allow to enable and disable voting mode', () => {
    const wrapper = mountWithRouter(Delegates, defaultProps, mockStore);
    wrapper.find('.start-voting-button').at(0).simulate('click');
    expect(wrapper.find('.addedVotes')).to.have.lengthOf(1);

    wrapper.find('.cancel-voting-button').at(0).simulate('click');
    expect(wrapper.find('.addedVotes')).to.have.lengthOf(0);
  });

  it('should not be in edit mode', () => {
    const wrapper = mountWithRouter(
      Delegates,
      defaultProps,
      {
        ...mockStore,
        history: {
          ...mockStore.history,
          location: {
            search: '?modal=votingSummary&isSubmitted=true',
          },
        },
      },
    );

    expect(wrapper.find('.start-voting-button')).to.have.lengthOf(2);
    expect(wrapper.find('.cancel-voting-button')).to.have.lengthOf(0);
  });

  it('should show onboarding if not in guest mode', () => {
    const wrapper = mountWithRouter(
      Delegates,
      defaultProps,
      { ...mockStore, account: { info: { LSK: { ...accounts.genesis } } } },
    );
    expect(wrapper.find('Onboarding')).to.have.lengthOf(1);
  });

  it('should not show "Register delegate" button if guest mode', () => {
    const wrapper = mountWithRouter(
      Delegates,
      defaultProps,
      { ...mockStore, account: {} },
    );
    expect(wrapper.find('.register-delegate')).to.have.lengthOf(0);
  });

  it('should show "Register delegate" button if not a delegate', () => {
    const noDelegateAccount = {
      loginType: loginType.normal,
      address: delegates[0].address,
      hwInfo: {},
    };
    const wrapper = mountWithRouter(
      Delegates,
      defaultProps,
      { ...mockStore, account: noDelegateAccount },
    );
    expect(wrapper.find('.register-delegate')).to.not.have.lengthOf(1);
  });

  it('should not show "Register delegate" button if already delegate', () => {
    const wrapper = mountWithRouter(
      Delegates,
      defaultProps,
      { ...mockStore, account: { delegate: delegates[0], address: delegates[0].address } },
    );
    expect(wrapper.find('.register-delegate')).to.have.lengthOf(0);
  });
});
