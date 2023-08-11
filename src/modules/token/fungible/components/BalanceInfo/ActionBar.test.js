import { act } from 'react-dom/test-utils';
import { mountWithRouterAndStore } from 'src/utils/testHelpers';
import { tokenMap } from '@token/fungible/consts/tokens';
import ActionBar from './ActionBar';

describe('Reclaim balance screen', () => {
  const hostAddress = 'lskmjr8hrnhzc6j653eto5fbh2p3kwdpa9ccdnhk6';
  const explorerAddress = 'lskc7ofju4nvnshg6349otmcssme9q87wrpf8umws';
  const props = {
    username: undefined,
    address: hostAddress,
    t: (t) => t,
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
    wallet: {
      passphrase: 'test',
      info: {
        LSK: {},
      },
    },
    token: { active: tokenMap.LSK.key },
    staking: {},
    settings: {
      network: { name: 'mainnet' },
    },
  };

  it('Should display register validator button and send', () => {
    const wrapper = mountWithRouterAndStore(
      ActionBar,
      props,
      {},
      { ...state, wallet: { info: { LSK: balanceAccount } } }
    );
    const html = wrapper.html();

    expect(html).toContain('open-send-dialog');
    expect(html).toContain('register-validator');
    expect(html).not.toContain('open-add-stake-dialog');
  });

  it('Should not display register validator button', () => {
    const wrapper = mountWithRouterAndStore(
      ActionBar,
      { ...props, activeToken: tokenMap.LSK.key, address: 'mnrutC4CgQhMos4f8HWYRy8rKQ3UisGwYJ' },
      {},
      { ...state, wallet: { info: { LSK: balanceAccount } } }
    );
    let html = wrapper.html();

    expect(html).toContain('open-send-dialog');
    expect(html).not.toContain('register-validator');
    expect(html).not.toContain('open-add-stake-dialog');

    wrapper.setProps({ address: explorerAddress });
    html = wrapper.html();

    expect(html).toContain('open-send-dialog');
    expect(html).not.toContain('register-validator');
    expect(html).not.toContain('open-add-stake-dialog');
  });

  it('Should display add/edit stake correctly', () => {
    let wrapper = mountWithRouterAndStore(
      ActionBar,
      { ...props, username: 'validator' },
      {},
      { ...state, wallet: { info: { LSK: balanceAccount } } }
    );
    let html = wrapper.html();

    expect(html).toContain('open-send-dialog');
    expect(html).not.toContain('register-validator');
    expect(html).toContain('open-add-stake-dialog');
    expect(html).toContain('Add to stakes');
    expect(html).not.toContain('Edit stake');

    wrapper = mountWithRouterAndStore(
      ActionBar,
      { ...props, username: 'validator' },
      {},
      {
        ...state,
        wallet: { info: { LSK: balanceAccount } },
        staking: {
          [balanceAccount.summary.address]: {},
        },
      }
    );
    act(() => {
      wrapper.update();
    });
    html = wrapper.html();

    expect(html).toContain('Edit stake');
    expect(html).not.toContain('Add to stakes');
  });

  it('Should disable buttons', () => {
    const wrapper = mountWithRouterAndStore(
      ActionBar,
      props,
      {},
      { ...state, wallet: { info: { LSK: noBalanceAccount } } }
    );
    const html = wrapper.html();

    expect(html).toContain('empty-balance-tooltip-wrapper');
    expect(html).toContain('emptyBalanceTooltipChild disabled');
    expect(wrapper.find('button.open-send-dialog')).toBeDisabled();
    expect(wrapper.find('button.register-validator')).toBeDisabled();
  });
});
