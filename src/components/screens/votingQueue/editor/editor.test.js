import { act } from 'react-dom/test-utils';
import { moduleAssetSchemas, minAccountBalance } from '@constants';

import { mountWithRouter } from '@utils/testHelpers';
import { getTransactionBaseFees, getTransactionFee } from '@api/transaction';
import useTransactionFeeCalculation from '@shared/transactionPriority/useTransactionFeeCalculation';
import { fromRawLsk } from '@utils/lsk';
import accounts from '../../../../../test/constants/accounts';
import flushPromises from '../../../../../test/unit-test-utils/flushPromises';
import Editor from './editor';

jest.mock('@shared/transactionPriority/useTransactionFeeCalculation');
jest.mock('@api/transaction');

const transactionBaseFees = {
  Low: 156,
  Medium: 100,
  High: 51,
};

const mockFeeFactor = 100;
getTransactionBaseFees.mockResolvedValue(transactionBaseFees);
getTransactionFee.mockImplementation((params) => {
  const selectedTransactionPriority = params.selectedPriority.selectedIndex;
  const fees = fromRawLsk(
    Object.values(transactionBaseFees)[selectedTransactionPriority] * mockFeeFactor,
  );
  return ({
    value: fees, feedback: '', error: false,
  });
});

useTransactionFeeCalculation.mockImplementation(() => ({
  minFee: { value: 0.001 },
  fee: { value: 0.01 },
}));

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

describe('VotingQueue.Editor', () => {
  moduleAssetSchemas['5:1'] = {
    $id: 'lisk/dpos/vote',
    type: 'object',
    required: [
      'votes',
    ],
    properties: {
      votes: {
        type: 'array',
        minItems: 1,
        maxItems: 20,
        items: {
          type: 'object',
          required: [
            'delegateAddress',
            'amount',
          ],
          properties: {
            delegateAddress: {
              dataType: 'bytes',
              fieldNumber: 1,
              minLength: 20,
              maxLength: 20,
            },
            amount: {
              dataType: 'sint64',
              fieldNumber: 2,
            },
          },
        },
        fieldNumber: 1,
      },
    },
  };

  const props = {
    t: str => str,
    account: accounts.genesis,
    nextStep: jest.fn(),
  };
  const mixedVotes = {
    [addresses[0]]: { confirmed: 1e10, unconfirmed: 1e10 },
    [addresses[1]]: { confirmed: 1e10, unconfirmed: 2e10 },
  };

  const elevenVotes = addresses.reduce((dict, item, index) => {
    if (index > 1) {
      dict[item] = { confirmed: 1e10, unconfirmed: 1e10 * index };
    }
    return dict;
  }, {});

  const expensiveVotes = {
    [addresses[0]]: {
      confirmed: 0, unconfirmed: Math.floor(parseInt(accounts.genesis.token.balance, 10) / 2),
    },
    [addresses[1]]: {
      confirmed: 0, unconfirmed: Math.floor(parseInt(accounts.genesis.token.balance, 10) / 2),
    },
  };

  const minimumBalanceVotes = {
    [addresses[0]]: {
      confirmed: 0, unconfirmed: Math.floor(parseInt(accounts.genesis.token.balance, 10) * 0.6),
    },
    [addresses[1]]: {
      confirmed: 0, unconfirmed: Math.floor(parseInt(accounts.genesis.token.balance, 10) * 0.4),
    },
  };

  afterEach(() => {
    // Reset balance
    props.account.token.balance = accounts.genesis.token.balance;
  });

  it('Render only the changed votes', () => {
    const wrapper = mountWithRouter(Editor, { ...props, votes: mixedVotes });
    expect(wrapper.find('VoteRow')).toHaveLength(1);
  });

  it('Shows an error if trying to vote for more than 10 delegates', () => {
    const wrapper = mountWithRouter(Editor, { ...props, votes: elevenVotes });
    expect(wrapper.find('.feedback').text()).toBe('You can\'t vote for more than 10 delegates.');
  });

  it('Shows an error if trying to vote more than your balance', async () => {
    const wrapper = mountWithRouter(Editor, { ...props, votes: expensiveVotes });
    await flushPromises();
    act(() => { wrapper.update(); });
    expect(wrapper.find('.feedback').text()).toBe('You don\'t have enough LSK in your account.');
  });

  it('Shows an error if trying to vote with amounts leading to insufficient balance', async () => {
    props.account.token.balance = `${parseInt(accounts.genesis.token.balance, 10) + (minAccountBalance * 0.8)}`;
    const wrapper = mountWithRouter(Editor, { ...props, votes: minimumBalanceVotes });
    await flushPromises();
    act(() => { wrapper.update(); });
    expect(wrapper.find('.feedback').text()).toBe('The vote amounts are too high. You should keep 0.05 LSK available in your account.');
  });
});
