import { mountWithQueryClient } from 'src/utils/testHelpers';
import * as keys from '@tests/constants/keys';
import { useTokensBalance } from '@token/fungible/hooks/queries';
import mockSavedAccounts from '@tests/fixtures/accounts';
import { mockAuth } from 'src/modules/auth/__fixtures__';

import { mockTokensBalance } from 'src/modules/token/fungible/__fixtures__';
import { usePosConstants } from '../../hooks/queries';
import { mockPosConstants } from '../../__fixtures__/mockPosConstants';
import useValidatorName from '../../hooks/useValidatorName';
import useValidatorKey from '../../hooks/useValidatorKey';
import RegisterValidatorForm from '.';

const mockCurrentAccount = mockSavedAccounts[0];

jest.mock('../../hooks/queries');
jest.mock('@token/fungible/hooks/queries');
jest.mock('@account/hooks/useCurrentAccount', () => ({
  useCurrentAccount: jest.fn(() => [mockCurrentAccount]),
}));
jest.mock('../../hooks/useValidatorName', () => jest.fn());
jest.mock('../../hooks/useValidatorKey', () => jest.fn());
jest.mock('@account/hooks/useDeprecatedAccount', () => ({
  useDeprecatedAccount: jest.fn().mockReturnValue({
    isSuccess: true,
    isLoading: false,
  }),
}));
jest.mock('@auth/hooks/queries', () => ({
  ...jest.requireActual('@auth/hooks/queries'),
  useAuth: jest.fn().mockReturnValue({ data: mockAuth }),
}));

const genKey = {
  value: keys.genKey,
  error: false,
  message: '',
};
const blsKey = {
  value: keys.blsKey,
  error: false,
  message: '',
};
const pop = {
  value: keys.pop,
  error: false,
  message: '',
};
const empty = {
  value: '',
  error: true,
  message: 'Can not be empty',
};

jest.useFakeTimers();

describe('RegisterValidatorForm', () => {
  const props = {
    prevState: {},
    nextStep: jest.fn(),
  };

  const setName = jest.fn();
  const setKey = jest.fn();

  usePosConstants.mockReturnValue({ data: mockPosConstants });
  useTokensBalance.mockReturnValue({ data: mockTokensBalance, isLoading: false });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Renders correctly', () => {
    it('renders properly RegisterValidatorForm component', () => {
      useValidatorName.mockReturnValue([empty, setName]);
      useValidatorKey.mockReturnValue([empty, setKey]);
      const wrapper = mountWithQueryClient(RegisterValidatorForm, props);
      expect(wrapper).toContainMatchingElement('.select-name-container');
      expect(wrapper).toContainMatchingElement('.select-name-input');
      expect(wrapper).toContainMatchingElement('.feedback');
      expect(wrapper).toContainMatchingElement('.confirm-btn');
      expect(wrapper.find('button.confirm-btn')).toBeDisabled();
    });

    it('type a valid and unused username', async () => {
      useValidatorName.mockReturnValue([empty, setName]);
      useValidatorKey.mockReturnValue([empty, setKey]);
      const wrapper = mountWithQueryClient(RegisterValidatorForm, props);

      wrapper
        .find('input.select-name-input')
        .simulate('change', { target: { value: 'myvalidator' } });
      wrapper
        .find('input.generator-publicKey-input')
        .simulate('change', { target: { value: genKey.value, name: 'generatorKey' } });
      wrapper
        .find('input.bls-key-input')
        .simulate('change', { target: { value: blsKey.value, name: 'blsKey' } });
      wrapper
        .find('input.pop-input')
        .simulate('change', { target: { value: pop.value, name: 'proofOfPossession' } });
      expect(setName).toHaveBeenCalledTimes(1);
      expect(setKey).toHaveBeenCalledWith(genKey.value);
      expect(setKey).toHaveBeenCalledWith(blsKey.value);
      expect(setKey).toHaveBeenCalledWith(pop.value);
    });
  });

  describe('Handles errors', () => {
    const wrongName = {
      value: 's',
      error: true,
      message: 'Too short',
    };
    const validName = {
      value: 'some_name',
      error: false,
      message: '',
    };
    const wrongKey = {
      value: 'wrong_value',
      error: true,
      message: 'Invalid hex value',
    };

    it('Display validator name input errors', () => {
      useValidatorKey.mockReturnValueOnce([genKey, setKey]);
      useValidatorKey.mockReturnValueOnce([blsKey, setKey]);
      useValidatorKey.mockReturnValueOnce([pop, setKey]);
      useValidatorName.mockReturnValue([wrongName, setName]); // invalid
      const wrapper = mountWithQueryClient(RegisterValidatorForm, props);
      expect(wrapper.find('button.confirm-btn')).toBeDisabled();
      expect(wrapper.find('.feedback').at(0)).toHaveText('Too short');
    });

    it('Display generator key input error', () => {
      useValidatorKey.mockReturnValueOnce([wrongKey, setKey]);
      useValidatorKey.mockReturnValueOnce([blsKey, setKey]);
      useValidatorKey.mockReturnValueOnce([pop, setKey]);
      useValidatorName.mockReturnValue([validName, setName]); // valid
      const wrapper = mountWithQueryClient(RegisterValidatorForm, props);
      expect(wrapper.find('button.confirm-btn')).toBeDisabled();
      expect(wrapper.find('.feedback').at(1)).toHaveText('Invalid hex value');
    });

    it('Display bls key input error', () => {
      useValidatorKey.mockReturnValueOnce([genKey, setKey]);
      useValidatorKey.mockReturnValueOnce([wrongKey, setKey]);
      useValidatorKey.mockReturnValueOnce([pop, setKey]);
      useValidatorName.mockReturnValue([validName, setName]); // valid
      const wrapper = mountWithQueryClient(RegisterValidatorForm, props);
      expect(wrapper.find('button.confirm-btn')).toBeDisabled();
      expect(wrapper.find('.feedback').at(2)).toHaveText('Invalid hex value');
    });

    it('Display pop key input error', () => {
      useValidatorKey.mockReturnValueOnce([genKey, setKey]);
      useValidatorKey.mockReturnValueOnce([blsKey, setKey]);
      useValidatorKey.mockReturnValueOnce([wrongKey, setKey]);
      useValidatorName.mockReturnValue([validName, setName]); // valid
      const wrapper = mountWithQueryClient(RegisterValidatorForm, props);
      expect(wrapper.find('button.confirm-btn')).toBeDisabled();
      expect(wrapper.find('.feedback').at(3)).toHaveText('Invalid hex value');
    });
  });

  describe('Pass valid tx', () => {
    const validName = {
      value: 'some_name',
      error: false,
      message: '',
    };
    const rawTx = {
      transactionJSON: {
        fee: '1000000000',
        module: 'pos',
        command: 'registerValidator',
        nonce: '0',
        params: {
          blsKey: blsKey.value,
          generatorKey: genKey.value,
          proofOfPossession: pop.value,
          name: validName.value,
        },
        signatures: [],
        senderPublicKey: mockCurrentAccount.metadata.pubkey,
      },
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
        extraCommandFee: '1000000000',
        fields: {
          token: mockTokensBalance.data[0],
        },
        isFormValid: true,
        moduleCommand: 'pos:registerValidator',
      },
      fees: [
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
      selectedPriority: { title: 'Normal', selectedIndex: 0, value: 0 },
    };

    it('accept a valid form', () => {
      useValidatorKey.mockReturnValueOnce([genKey, setKey]);
      useValidatorKey.mockReturnValueOnce([blsKey, setKey]);
      useValidatorKey.mockReturnValueOnce([pop, setKey]);
      useValidatorName.mockReturnValue([validName, setName]); // valid
      const wrapper = mountWithQueryClient(RegisterValidatorForm, props);
      wrapper.find('button.confirm-btn').simulate('click');
      expect(props.nextStep).toHaveBeenCalledWith(rawTx);
    });
  });
});
