import React from 'react';
import { act } from 'react-dom/test-utils';
import { shallow } from 'enzyme';
import Table from '@theme/table';
import { mockTokensBalance } from 'src/modules/token/fungible/__fixtures__';
import { MIN_ACCOUNT_BALANCE } from '@transaction/configuration/transactions';
import { mountWithRouterAndQueryClient } from 'src/utils/testHelpers';
import accounts from '@tests/constants/wallets';
import flushPromises from '@tests/unit-test-utils/flushPromises';
import { useTokensBalance } from '@token/fungible/hooks/queries';
import { useCommandSchema } from '@network/hooks/useCommandsSchema';
import { mockCommandParametersSchemas } from 'src/modules/common/__fixtures__';
import StakeRow from './StakeRow';
import StakeForm from './StakeForm';
import { usePosConstants } from '../../hooks/queries';
import { mockPosConstants } from '../../__fixtures__/mockPosConstants';

jest.mock('@token/fungible/hooks/queries');
jest.mock('../../hooks/queries/usePosConstants');
jest.mock('@account/hooks/useDeprecatedAccount', () => ({
  useDeprecatedAccount: jest.fn().mockReturnValue({
    isSuccess: true,
    isLoading: false,
  }),
}));

jest.mock('@account/hooks/useDeprecatedAccount', () => ({
  useDeprecatedAccount: jest.fn().mockReturnValue({
    isSuccess: true,
    isLoading: false,
  }),
}));
jest.mock('@network/hooks/useCommandsSchema');

const addresses = [
  'lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y99',
  'lskyau2yy4993jkbd7kxcsfsrarac8macbbs8saad',
  'lskv9tm4z6deg3wu53osxs5cr4sbz7o24qqxyk57k',
  'lskumc3ec2wzzzzxtcekzbhajo6y3jg8gcaz52jo5',
  'lskxsnyj33zzzzzz7upwkfrcjocxkse56arbupru6',
  'lskajvtut6wzj5ah4ky7o5roo4fu7uzsywkawa94w',
  'lskurg8nyooztpsxodaqqcmhtc64xp5rabbdet3w2',
  'lskk4drn4kdt2qp39n2vdx7hxhqbkyvak668j9zcm',
  'lskdea5kprt8c89b2sgntv3u6optuuoe7q7f23vaw',
  'lskrgs75gvfy29ah9m5bmraenr46dxo3cw8xsnqyz',
  'lskyhyc9z5e8eg25sokdho5o8mymgacfbp4kx7tcd',
  'lskzzovs6sbs87pkr8kndsspkrox4z5237wbqh9zf',
  'lskarccxj6xqdeqtuvakr3hjdjh8a6df73b6pqk6s',
];

describe('StakeForm', () => {
  const props = {
    t: (str) => str,
    account: accounts.genesis,
    nextStep: jest.fn(),
    posToken: mockTokensBalance.data[0],
  };

  const mixedStakes = {
    [addresses[0]]: { confirmed: 1e10, unconfirmed: 1e10 },
    [addresses[1]]: { confirmed: 1e10, unconfirmed: 2e10 },
  };

  const elevenStakes = addresses.reduce((dict, item, index) => {
    if (index > 1) {
      dict[item] = {
        confirmed: index > 9 ? 0 : 1e10,
        unconfirmed: 1e10 * index,
      };
    }
    return dict;
  }, {});

  const expensiveStakes = {
    [addresses[0]]: {
      confirmed: 0,
      unconfirmed: Math.floor(parseInt(accounts.genesis.token.balance, 10) / 2),
    },
    [addresses[1]]: {
      confirmed: 0,
      unconfirmed: Math.floor(parseInt(accounts.genesis.token.balance, 10) / 2),
    },
  };

  const minimumBalanceStakes = {
    [addresses[0]]: {
      confirmed: 0,
      unconfirmed: Math.floor(parseInt(accounts.genesis.token.balance, 10) * 0.6),
    },
    [addresses[1]]: {
      confirmed: 0,
      unconfirmed: Math.floor(parseInt(accounts.genesis.token.balance, 10) * 0.4),
    },
  };

  afterEach(() => {
    // Reset balance
    props.account.token.balance = accounts.genesis.token.balance;
  });

  useTokensBalance.mockReturnValue({ data: mockTokensBalance, isLoading: false });
  usePosConstants.mockReturnValue({ data: mockPosConstants });
  useCommandSchema.mockReturnValue({
    moduleCommandSchemas: mockCommandParametersSchemas.data.commands.reduce(
      (result, { moduleCommand, schema }) => ({ ...result, [moduleCommand]: schema }),
      {}
    ),
  });

  it('Render only the changed Stakes', async () => {
    const wrapper = shallow(<StakeForm {...props} stakes={mixedStakes} />);
    const table = wrapper.find(Table);
    expect(table.props()).toEqual(
      expect.objectContaining({
        data: [
          {
            address: 'lskyau2yy4993jkbd7kxcsfsrarac8macbbs8saad',
            confirmed: 10000000000,
            unconfirmed: 20000000000,
          },
        ],
        header: expect.any(Object),
        row: StakeRow,
        iterationKey: 'address',
        canLoadMore: false,
      })
    );
    expect(wrapper.find('.available-stakes-num').text()).toBe('8/');
  });

  it('Shows an error if trying to stake for more than 10 validators', () => {
    const wrapper = shallow(<StakeForm {...props} stakes={elevenStakes} />);
    expect(wrapper.find('.available-stakes-num').text()).toBe('-1/');
    expect(wrapper.find('.feedback').text()).toBe(
      'These stakes in addition to your current stakes will add up to 11, exceeding the account limit of 10.'
    );
  });

  it('Shows an error if trying to stake more than your balance', async () => {
    const wrapper = mountWithRouterAndQueryClient(StakeForm, { ...props, stakes: expensiveStakes });
    await flushPromises();
    act(() => {
      wrapper.update();
    });
    expect(wrapper.find('.available-stakes-num').text()).toBe('8/');
    expect(wrapper.find('.feedback').at(0).text()).toBe(
      "You don't have enough LSK in your account."
    );
  });

  it('Shows an error if trying to stake with amounts leading to insufficient balance', async () => {
    props.account.token.balance = `${parseInt(accounts.genesis.token.balance, 10) + MIN_ACCOUNT_BALANCE * 0.8
    }`;
    const wrapper = mountWithRouterAndQueryClient(StakeForm, { ...props, stakes: minimumBalanceStakes });
    await flushPromises();
    act(() => {
      wrapper.update();
    });
    expect(wrapper.find('.available-stakes-num').text()).toBe('8/');
    expect(wrapper.find('.feedback').at(0).text()).toBe(
      "You don't have enough LSK in your account."
    );
  });
});
