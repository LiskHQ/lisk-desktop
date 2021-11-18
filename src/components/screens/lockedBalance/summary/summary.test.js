import { mountWithRouterAndStore } from '@utils/testHelpers';
import Summary from './index';
import accounts from '../../../../../test/constants/accounts';

describe.skip('Locked balance Summary', () => {
  const props = {
    currentBlockHeight: 10000000,
    balanceUnlocked: jest.fn(),
    rawTransaction: {
      selectedFee: '2500000000000',
    },
    nextStep: jest.fn(),
    prevStep: jest.fn(),
    t: key => key,
    account: accounts.genesis,
  };
  const state = {
    transactions: {
      txSignatureError: null,
      signedTransaction: { id: 1 },
    },
    account: { info: { LSK: accounts.genesis } },
    blocks: {
      latestBlocks: [{ height: 10000000 }],
    },
    network: { networks: { LSK: {} } },
  };

  afterEach(() => {
    props.nextStep.mockRestore();
  });

  it('renders properly Summary component', () => {
    const wrapper = mountWithRouterAndStore(
      Summary,
      props,
      {},
      state,
    );
    expect(wrapper).toContainMatchingElement('.address-label');
    expect(wrapper).toContainMatchingElement('.amount-label');
    expect(wrapper).toContainMatchingElement('button.confirm-button');
    expect(wrapper).toContainMatchingElement('button.cancel-button');
  });

  it('go to prev page when click Go Back button', () => {
    const wrapper = mountWithRouterAndStore(
      Summary,
      props,
      {},
      state,
    );
    expect(props.prevStep).not.toBeCalled();
    wrapper.find('button.cancel-button').simulate('click');
    expect(props.prevStep).toBeCalled();
  });

  it('submit user data when click in confirm button', () => {
    const wrapper = mountWithRouterAndStore(
      Summary,
      props,
      {},
      state,
    );
    expect(props.nextStep).not.toBeCalled();
    wrapper.find('button.confirm-button').simulate('click');
    expect(props.nextStep).toBeCalled();
  });

  it('submit user data when click in confirm button but fails', () => {
    const error = { message: 'some error' };
    const wrapper = mountWithRouterAndStore(
      Summary,
      props,
      {},
      {
        account: state.account,
        transactions: {
          txSignatureError: error,
          signedTransaction: { id: 1 },
        },
      },
    );
    wrapper.find('button.confirm-button').simulate('click');
    expect(props.nextStep).toBeCalledWith({ error });
  });
});
