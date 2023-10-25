import { smartRender } from 'src/utils/testHelpers';
import wallets from '@tests/constants/wallets';
import mockSavedAccounts from '@tests/fixtures/accounts';
import { useAuth } from '@auth/hooks/queries';
import { mockAppsTokens } from '@token/fungible/__fixtures__';
import usePosToken from '@pos/validator/hooks/usePosToken';
import { mockAuth } from 'src/modules/auth/__fixtures__';
import Summary from './UnlockBalanceSummary';

const mockedCurrentAccount = mockSavedAccounts[0];
const config = {
  queryClient: true,
  renderType: 'mount',
};
jest.mock('@account/hooks', () => ({
  ...jest.requireActual('@account/hooks'),
  useCurrentAccount: jest.fn(() => [mockedCurrentAccount, jest.fn()]),
}));
jest.mock('@auth/hooks/queries');
jest.mock('@pos/validator/hooks/usePosToken');

describe('Locked balance Summary', () => {
  const props = {
    currentBlockHeight: 10000000,
    balanceUnlocked: jest.fn(),
    formProps: {
      composedFees: [
        {
          title: 'Transaction',
          value: '0 LSK',
          components: [],
        },
        {
          title: 'Message',
          value: '0 LSK',
          isHidden: true,
          components: [],
        },
      ],
      isValid: true,
      moduleCommand: 'pos:unlock',
    },
    selectedPriority: { title: 'Normal', selectedIndex: 0, value: 0 },
    transactionJSON: {
      fee: '0',
      nonce: '1',
      signatures: [],
      senderPublicKey: wallets.genesis.summary.publicKey,
      module: 'pos',
      command: 'unlock',
    },
    nextStep: jest.fn(),
    prevStep: jest.fn(),
    t: (key) => key,
    wallet: wallets.genesis,
  };

  afterEach(() => {
    props.nextStep.mockRestore();
  });

  useAuth.mockReturnValue({ data: mockAuth });
  usePosToken.mockReturnValue({ token: mockAppsTokens.data[0] });

  it('renders properly Summary component', () => {
    const wrapper = smartRender(Summary, props, config).wrapper;
    expect(wrapper).toContainMatchingElement('.address-label');
    expect(wrapper).toContainMatchingElement('.amount-label');
    expect(wrapper).toContainMatchingElement('button.confirm-button');
    expect(wrapper).toContainMatchingElement('button.cancel-button');
  });

  it('go to prev page when click Go back button', () => {
    const wrapper = smartRender(Summary, props, config).wrapper;
    expect(props.prevStep).not.toBeCalled();
    wrapper.find('button.cancel-button').simulate('click');
    expect(props.prevStep).toBeCalled();
  });

  it('submit transaction and action function when click in confirm button', () => {
    const wrapper = smartRender(Summary, props, config).wrapper;
    expect(props.nextStep).not.toBeCalled();
    wrapper.find('button.confirm-button').simulate('click');
    expect(props.nextStep).toBeCalledWith({
      actionFunction: props.balanceUnlocked,
      formProps: props.formProps,
      transactionJSON: props.transactionJSON,
    });
  });
});
