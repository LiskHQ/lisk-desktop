import { mountWithRouterAndStore } from '@utils/testHelpers';
import { tokenMap } from '@constants';
import ActionBar from './actionBar';

describe('Reclaim balance screen', () => {
  const hostAddress = 'lskmjr8hrnhzc6j653eto5fbh2p3kwdpa9ccdnhk6';
  const explorerAddress = 'lskc7ofju4nvnshg6349otmcssme9q87wrpf8umws';
  let wrapper;
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
  };

  it('Should display register delegate button and send', () => {
    { wrapper } = mountWithRouterAndStore(
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
    { wrapper } = mountWithRouterAndStore(
      ActionBar,
      { ...props, activeToken: tokenMap.BTC.key, address: 'mnrutC4CgQhMos4f8HWYRy8rKQ3UisGwYJ' },
      {},
      { ...state, account: { info: { LSK: balanceAccount } } },
    );
    let html = wrapper.html();

    expect(html).toContain('open-send-dialog');
    expect(html).not.toContain('register-delegate');
    expect(html).not.toContain('open-add-vote-dialog');

    { wrapper } = mountWithRouterAndStore(
      ActionBar,
      { ...props, address: explorerAddress },
      {},
      { ...state, account: { info: { LSK: balanceAccount } } },
    );
    html = wrapper.html();

    expect(html).toContain('open-send-dialog');
    expect(html).not.toContain('register-delegate');
    expect(html).not.toContain('open-add-vote-dialog');
  });

  it('Should display add/edit vote correctly', () => {
    { wrapper } = mountWithRouterAndStore(
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

    { wrapper } = mountWithRouterAndStore(
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
    html = wrapper.html();

    expect(html).toContain('Edit vote');
    expect(html).not.toContain('Add to votes');
  });

  it('Should disable buttons', () => {
    { wrapper } = mountWithRouterAndStore(
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
