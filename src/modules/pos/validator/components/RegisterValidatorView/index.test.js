import debounce from 'lodash.debounce';
import { mountWithRouterAndQueryClient } from 'src/utils/testHelpers';
import { getTransactionBaseFees, getTransactionFee } from '@transaction/api';
import RegisterDelegate from './index';

jest.mock('@account/hooks/useDeprecatedAccount', () => ({
  useDeprecatedAccount: jest.fn().mockReturnValue({
    isSuccess: true,
    isLoading: false
  }),
}));
jest.mock('lodash.debounce');
jest.mock('@transaction/api');
jest.mock('@libs/wcm/hooks/useSession', () => ({
  respond: jest.fn(),
}));

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

describe('RegisterDelegate', () => {
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
    validatorRegistered: jest.fn(),
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
    const wrapper = mountWithRouterAndQueryClient(RegisterDelegate, props);
    expect(wrapper).toContainMatchingElement('.select-name-container');
    expect(wrapper).toContainMatchingElement('.select-name-input');
    expect(wrapper).toContainMatchingElement('.feedback');
    expect(wrapper).toContainMatchingElement('.confirm-btn');
  });
});
