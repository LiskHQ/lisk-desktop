import debounce from 'lodash.debounce';
import { mountWithRouter } from '@utils/testHelpers';
import { getTransactionBaseFees, getTransactionFee } from '@api/transaction';
import RegisterDelegate from './registerDelegate';

jest.mock('lodash.debounce');
jest.mock('@api/transaction');

getTransactionBaseFees.mockResolvedValue({
  Low: 0,
  Medium: 1000,
  High: 2000,
});

getTransactionFee.mockResolvedValue({
  value: 0.1,
  error: false,
  feedback: '',
});

describe.skip('RegisterDelegate', () => {
  const props = {
    account: {
      info: {
        LSK: {
          summary: {
            address: '123456789L',
            balance: 11000,
          },
          token: { balance: 11000 },
        },
      },
    },
    history: {
      push: jest.fn(),
      goBack: jest.fn(),
    },
    prevState: {},
    delegate: {},
    liskAPIClient: {
      delegates: {
        get: jest.fn(),
      },
    },
    delegateRegistered: jest.fn(),
    nextStep: jest.fn(),
    t: key => key,
    transactions: {
      signedTransaction: {},
    },
  };

  beforeEach(() => {
    props.liskAPIClient.delegates.get.mockClear();
    debounce.mockReturnValue((name, error) => !error && props.liskAPIClient.delegates.get(name));
  });

  it('renders properly SelectName component', () => {
    const wrapper = mountWithRouter(RegisterDelegate, props);
    expect(wrapper).toContainMatchingElement('.select-name-container');
    expect(wrapper).toContainMatchingElements(2, '.select-name-text-description');
    expect(wrapper).toContainMatchingElement('.select-name-input');
    expect(wrapper).toContainMatchingElement('.feedback');
    expect(wrapper).toContainMatchingElement('.confirm-btn');
  });
});
