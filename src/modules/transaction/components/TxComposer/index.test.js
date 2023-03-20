import { MODULE_COMMANDS_NAME_MAP } from 'src/modules/transaction/configuration/moduleCommand';
import { useCommandSchema } from '@network/hooks/useCommandsSchema';
import { mountWithQueryClient, mountWithQueryAndProps } from 'src/utils/testHelpers';
import { mockCommandParametersSchemas } from 'src/modules/common/__fixtures__';
import accounts from '@tests/constants/wallets';
import { genKey, blsKey, pop } from '@tests/constants/keys';
import * as encodingUtils from '../../utils/encoding';
import TxComposer from './index';

jest.mock('@network/hooks/useCommandsSchema');
jest.spyOn(encodingUtils, 'fromTransactionJSON').mockImplementation((tx) => tx);
jest.mock('@account/hooks/useDeprecatedAccount', () => ({
  useDeprecatedAccount: jest.fn().mockReturnValue({
    isSuccess: true,
    isLoading: false,
  }),
}));
jest.mock('@liskhq/lisk-client', () => ({
  ...jest.requireActual('@liskhq/lisk-client'),
  transactions: {
    computeMinFee: jest.fn().mockReturnValue(10000000000n),
    getBytes: jest.fn().mockReturnValue({ length: 50 }),
  },
}));

describe('TxComposer', () => {
  const props = {
    children: null,
    onComposed: jest.fn(),
    onConfirm: jest.fn(),
    className: 'test-class-name',
    formProps: {
      feedback: [],
      moduleCommand: MODULE_COMMANDS_NAME_MAP.transfer,
      fields: { token: { availableBalance: 10000, symbol: 'LSK' } },
    },
    commandParams: {
      recipient: { address: accounts.genesis.summary.address },
      amount: 100000,
      data: 'test-data',
      token: { tokenID: '00000000' },
    }
  };

  useCommandSchema.mockReturnValue({
    moduleCommandSchemas: mockCommandParametersSchemas.data.commands.reduce(
      (result, { moduleCommand, schema }) => ({ ...result, [moduleCommand]: schema }),
      {}
    ),
  });

  it('should provide feedback when form is invalid', () => {
    const newProps = {
      ...props,
      commandParams: {},
      formProps: {
        isFormValid: false,
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

  it('should provide feedback when balance is insufficient', () => {
    const newProps = {
      ...props,
      formProps: {
        isFormValid: true,
        moduleCommand: MODULE_COMMANDS_NAME_MAP.registerValidator,
        fields: {
          token: {
            availableBalance: 100,
            symbol: 'LSK',
            denomUnits: [
              {
                denom: 'lsk',
                decimals: 8,
                aliases: ['Lisk'],
              },
            ],
          },
        },
        extraCommandFee: 100000000000,
      },
      commandParams: {
        name: 'test_username',
        generatorKey: genKey,
        blsKey,
        proofOfPossession: pop,
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

  it('should render transaction form when transaction is valid', () => {
    const newProps = {
      ...props,
      buttonTitle: "Continue to stake",
      formProps: {
        isFormValid: true,
        moduleCommand: MODULE_COMMANDS_NAME_MAP.transfer,
        fields: { token: { availableBalance: 10000000000000 } },
        sendingChain: { chainID: '1' },
        recipientChain: { chainID: '2' },
      },
      commandParams: {},
    };

    const wrapper = mountWithQueryClient(TxComposer, newProps);
    expect(wrapper.find('TransactionPriority')).toExist();
    expect(wrapper.find('Feedback').html()).toEqual(null);
    expect(wrapper.find('.confirm-btn')).toExist();
    expect(wrapper.find('.confirm-btn').at(0).props().disabled).toEqual(false);
    expect(wrapper.find('.confirm-btn').at(0).props().children).toEqual('Continue to stake');
  });
});
