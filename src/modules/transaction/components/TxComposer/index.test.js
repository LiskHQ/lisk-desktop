import { MODULE_COMMANDS_NAME_MAP } from 'src/modules/transaction/configuration/moduleCommand';
import { useCommandSchema } from '@network/hooks/useCommandsSchema';
import { mountWithQueryClient, mountWithQueryAndProps } from 'src/utils/testHelpers';
import { mockCommandParametersSchemas } from 'src/modules/common/__fixtures__';
import accounts from '@tests/constants/wallets';
import { genKey, blsKey, pop } from '@tests/constants/keys';
import TxComposer from './index';


jest.mock('@network/hooks/useCommandsSchema');

jest.mock('@account/hooks/useDeprecatedAccount', () => ({
  useDeprecatedAccount: jest.fn().mockReturnValue({
    isSuccess: true,
    isLoading: false,
  }),
}));

describe('TxComposer', () => {
  const commandParams = {
    tokenID: '00000000',
    amount: 100000,
    recipientAddress: accounts.genesis.summary.address,
    data: 'test-data',
  };
  const props = {
    children: null,
    commandParams,
    onComposed: jest.fn(),
    onConfirm: jest.fn(),
    className: 'test-class-name',
    buttonTitle: 'test-button-title',
    formProps: {
      moduleCommand: MODULE_COMMANDS_NAME_MAP.transfer,
    },
  };

  useCommandSchema.mockReturnValue(
    mockCommandParametersSchemas.data.commands.reduce(
      (result, { moduleCommand, schema }) => ({ ...result, [moduleCommand]: schema }),
      {}
    )
  );

  it('should render TxComposer correctly for a valid tx', () => {
    const newProps = {
      ...props,
      formProps: {
        isValid: true,
        moduleCommand: MODULE_COMMANDS_NAME_MAP.transfer,
        fields: { token: { availableBalance: 100000000 } },
        sendingChain: { chainID: '1' },
        recipientChain: { chainID: '2' }
      },
    };
    const wrapper = mountWithQueryClient(TxComposer, newProps);
    expect(wrapper.find('TransactionPriority')).toExist();
    expect(wrapper.find('Feedback').html()).toEqual(null);
    expect(wrapper.find('.confirm-btn')).toExist();
    expect(wrapper.find('.confirm-btn').at(0).props().disabled).toEqual(false);
  });

  it('should render TxComposer correctly for an invalid tx', () => {
    const newProps = {
      ...props,
      formProps: {
        isValid: false,
        moduleCommand: MODULE_COMMANDS_NAME_MAP.transfer,
        fields: { token: { availableBalance: 1000000000000000 } },
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
        moduleCommand: MODULE_COMMANDS_NAME_MAP.registerValidator,
        params: {
          name: 'test_username',
          generatorKey: genKey,
          blsKey,
          proofOfPossession: pop,
        },
      },
    };
    const state = {
      wallet: { info: { LSK: accounts.empty_wallet } },
    };
    const wrapper = mountWithQueryAndProps(TxComposer, newProps, state);
    expect(wrapper.find('TransactionPriority')).toExist();
    expect(wrapper.find('Feedback').text()).toEqual(
      'The minimum required balance for this action is {{minRequiredBalance}} {{token}}'
    );
    expect(wrapper.find('.confirm-btn').at(0).props().disabled).toEqual(true);
  });
});
