import { MODULE_COMMANDS_NAME_MAP } from 'src/modules/transaction/configuration/moduleCommand';
import accounts from '@tests/constants/wallets';
import {
  mountWithQueryClient,
  mountWithQueryAndProps,
} from 'src/utils/testHelpers';
import { genKey, blsKey, pop } from '@tests/constants/keys';
import TxComposer from './index';

jest.mock('@account/hooks/useDeprecatedAccount', () => ({
  useDeprecatedAccount: jest.fn().mockReturnValue({
    isSuccess: true,
    isLoading: false
  }),
}));

describe('TxComposer', () => {
  const transaction = {
    moduleCommand: MODULE_COMMANDS_NAME_MAP.transfer,
    params: {
      recipient: { address: accounts.genesis.summary.address },
      amount: 100000,
      data: 'test-data',
    },
    isValid: true,
    feedback: [],
  };
  const props = {
    children: null,
    transaction,
    onComposed: jest.fn(),
    onConfirm: jest.fn(),
    className: 'test-class-name',
    buttonTitle: 'test-button-title',
  };

  it('should render TxComposer correctly for a valid tx', () => {
    const wrapper = mountWithQueryClient(TxComposer, props);
    expect(wrapper.find('TransactionPriority')).toExist();
    expect(wrapper.find('Feedback').html()).toEqual(null);
    expect(wrapper.find('.confirm-btn')).toExist();
    expect(wrapper.find('.confirm-btn').at(0).props().disabled).toEqual(false);
  });

  it('should render TxComposer correctly for an invalid tx', () => {
    const newProps = {
      ...props,
      transaction: {
        ...props.transaction,
        isValid: false,
        feedback: ['Test error feedback'],
      },
    };
    const wrapper = mountWithQueryClient(TxComposer, newProps);
    expect(wrapper.find('TransactionPriority')).toExist();
    expect(wrapper.find('Feedback').text()).toEqual('Test error feedback');
    expect(wrapper.find('.confirm-btn').at(0).props().disabled).toEqual(true);
  });

  it('should render TxComposer correctly if the balance is insufficient', () => {
    const newProps = {
      ...props,
      transaction: {
        isValid: true,
        feedback: [],
        moduleCommand: MODULE_COMMANDS_NAME_MAP.registerDelegate,
        params: {
          username: 'test_username',
          generatorPublicKey: genKey,
          blsPublicKey: blsKey,
          proofOfPossession: pop,
        },
      },
    };
    const state = {
      wallet: { info: { LSK: accounts.empty_wallet } },
    };
    const wrapper = mountWithQueryAndProps(TxComposer, newProps, state);
    expect(wrapper.find('TransactionPriority')).toExist();
    expect(wrapper.find('Feedback').text()).toEqual('The minimum required balance for this action is {{minRequiredBalance}} {{token}}');
    expect(wrapper.find('.confirm-btn').at(0).props().disabled).toEqual(true);
  });
});
