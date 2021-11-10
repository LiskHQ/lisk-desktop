import { act } from 'react-dom/test-utils';
import { mountWithRouterAndStore } from '@utils/testHelpers';
import { tokenMap } from '@constants';
import ActionBar from './actionBar';

describe('Reclaim balance screen', () => {
  const hostAddress = 'lskmjr8hrnhzc6j653eto5fbh2p3kwdpa9ccdnhk6';
  const explorerAddress = 'lskc7ofju4nvnshg6349otmcssme9q87wrpf8umws';
  const props = {
    username: undefined,
    address: hostAddress,
    t: t => t,
    isWalletRoute: true,
    activeToken: tokenMap.LSK.key,
  };
  const noBalanceAccount = {
    summary: {
      address: hostAddress,
      balance: 0,
    },
  };
  const balanceAccount = {
    summary: {
      address: hostAddress,
      balance: 100000,
    },
  };
  const state = {
    account: {
      passphrase: 'test',
      info: {
        LSK: { },
      },
    },
    settings: { token: { active: tokenMap.LSK.key } },
    voting: {},
  };

  it('Should display register delegate button and send', () => {
    const wrapper = mountWithRouterAndStore(
      ActionBar,
      props,
      {},
      { ...state, account: { info: { LSK: balanceAccount } } },
    );
    const html = wrapper.html();

    expect(html).toContain('open-send-dialog');
    expect(html).toContain('register-delegate');
    expect(html).not.toContain('open-add-vote-dialog');
  });

  it('Should not display register delegate button', () => {
    const wrapper = mountWithRouterAndStore(
      ActionBar,
      { ...props, activeToken: tokenMap.BTC.key, address: 'mnrutC4CgQhMos4f8HWYRy8rKQ3UisGwYJ' },
      {},
      { ...state, account: { info: { LSK: balanceAccount } } },
    );
    let html = wrapper.html();

    expect(html).toContain('open-send-dialog');
    expect(html).not.toContain('register-delegate');
    expect(html).not.toContain('open-add-vote-dialog');

    wrapper.setProps({ address: explorerAddress });
    html = wrapper.html();

    expect(html).toContain('open-send-dialog');
    expect(html).not.toContain('register-delegate');
    expect(html).not.toContain('open-add-vote-dialog');
  });

  it('Should display add/edit vote correctly', () => {
    let wrapper = mountWithRouterAndStore(
      ActionBar,
      { ...props, username: 'delegate' },
      {},
      { ...state, account: { info: { LSK: balanceAccount } } },
    );
    let html = wrapper.html();

    expect(html).toContain('open-send-dialog');
    expect(html).not.toContain('register-delegate');
    expect(html).toContain('open-add-vote-dialog');
    expect(html).toContain('Add to votes');
    expect(html).not.toContain('Edit vote');

    const result = mountWithRouterAndStore(
      ActionBar,
      { ...props, username: 'delegate' },
      {},
      {
        ...state,
        account: { info: { LSK: balanceAccount } },
        voting: {
          [balanceAccount.summary.address]: {},
        },
      },
    );
    wrapper = result.wrapper;
    act(() => { wrapper.update(); });
    html = wrapper.html();

    expect(html).toContain('Edit vote');
    expect(html).not.toContain('Add to votes');
  });

  it('Should disable buttons', () => {
    const wrapper = mountWithRouterAndStore(
      ActionBar,
      props,
      {},
      { ...state, account: { info: { LSK: noBalanceAccount } } },
    );
    const html = wrapper.html();

    expect(html).toContain('empty-balance-tooltip-wrapper');
    expect(html).toContain('emptyBalanceTooltipChild disabled');
    expect(wrapper.find('button.open-send-dialog')).toBeDisabled();
    expect(wrapper.find('button.register-delegate')).toBeDisabled();
  });
});
