import { mountWithQueryClient } from 'src/utils/testHelpers';
import wallets from '@tests/constants/wallets';
import * as keys from '@tests/constants/keys';
import useDelegateName from '../../hooks/useDelegateName';
import useDelegateKey from '../../hooks/useDelegateKey';
import RegisterDelegateForm from '.';

jest.mock('../../hooks/useDelegateName', () => jest.fn());
jest.mock('../../hooks/useDelegateKey', () => jest.fn());

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

describe('RegisterDelegateForm', () => {
  const props = {
    prevState: {},
    nextStep: jest.fn(),
  };

  const setName = jest.fn();
  const setKey = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Renders correctly', () => {
    it('renders properly RegisterDelegateForm component', () => {
      useDelegateName.mockReturnValue([empty, setName]);
      useDelegateKey.mockReturnValue([empty, setKey]);
      const wrapper = mountWithQueryClient(RegisterDelegateForm, props);
      expect(wrapper).toContainMatchingElement('.select-name-container');
      expect(wrapper).toContainMatchingElement('.select-name-input');
      expect(wrapper).toContainMatchingElement('.feedback');
      expect(wrapper).toContainMatchingElement('.confirm-btn');
      expect(wrapper.find('button.confirm-btn')).toBeDisabled();
    });

    it('type a valid and unused username', async () => {
      useDelegateName.mockReturnValue([empty, setName]);
      useDelegateKey.mockReturnValue([empty, setKey]);
      const wrapper = mountWithQueryClient(RegisterDelegateForm, props);

      wrapper
        .find('input.select-name-input')
        .simulate('change', { target: { value: 'mydelegate' } });
      wrapper
        .find('input.generator-publicKey-input')
        .simulate('change', { target: { value: genKey.value, name: 'generatorPublicKey' } });
      wrapper
        .find('input.bls-key-input')
        .simulate('change', { target: { value: blsKey.value, name: 'blsPublicKey' } });
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

    it('Display delegate name input errors', () => {
      useDelegateKey.mockReturnValueOnce([genKey, setKey]);
      useDelegateKey.mockReturnValueOnce([blsKey, setKey]);
      useDelegateKey.mockReturnValueOnce([pop, setKey]);
      useDelegateName.mockReturnValue([wrongName, setName]); // invalid
      const wrapper = mountWithQueryClient(RegisterDelegateForm, props);
      expect(wrapper.find('button.confirm-btn')).toBeDisabled();
      expect(wrapper.find('.feedback').at(0)).toHaveText('Too short');
    });

    it('Display generator key input error', () => {
      useDelegateKey.mockReturnValueOnce([wrongKey, setKey]);
      useDelegateKey.mockReturnValueOnce([blsKey, setKey]);
      useDelegateKey.mockReturnValueOnce([pop, setKey]);
      useDelegateName.mockReturnValue([validName, setName]); // valid
      const wrapper = mountWithQueryClient(RegisterDelegateForm, props);
      expect(wrapper.find('button.confirm-btn')).toBeDisabled();
      expect(wrapper.find('.feedback').at(1)).toHaveText('Invalid hex value');
    });

    it('Display bls key input error', () => {
      useDelegateKey.mockReturnValueOnce([genKey, setKey]);
      useDelegateKey.mockReturnValueOnce([wrongKey, setKey]);
      useDelegateKey.mockReturnValueOnce([pop, setKey]);
      useDelegateName.mockReturnValue([validName, setName]); // valid
      const wrapper = mountWithQueryClient(RegisterDelegateForm, props);
      expect(wrapper.find('button.confirm-btn')).toBeDisabled();
      expect(wrapper.find('.feedback').at(2)).toHaveText('Invalid hex value');
    });

    it('Display pop key input error', () => {
      useDelegateKey.mockReturnValueOnce([genKey, setKey]);
      useDelegateKey.mockReturnValueOnce([blsKey, setKey]);
      useDelegateKey.mockReturnValueOnce([wrongKey, setKey]);
      useDelegateName.mockReturnValue([validName, setName]); // valid
      const wrapper = mountWithQueryClient(RegisterDelegateForm, props);
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
      fees: {
        Transaction: '0 LSK',
        Initialisation: '0 LSK',
      },
      rawTx: {
        fee: 0,
        moduleCommand: 'dpos:registerDelegate',
        nonce: '1',
        params: {
          blsPublicKey: blsKey.value,
          generatorPublicKey: genKey.value,
          proofOfPossession: pop.value,
          username: validName.value,
        },
        sender: {
          publicKey: wallets.genesis.summary.publicKey,
        },
      },
      selectedPriority: { title: 'Normal', selectedIndex: 0, value: 0 },
      trnxData: undefined,
    };

    it('accept a valid form', () => {
      useDelegateKey.mockReturnValueOnce([genKey, setKey]);
      useDelegateKey.mockReturnValueOnce([blsKey, setKey]);
      useDelegateKey.mockReturnValueOnce([pop, setKey]);
      useDelegateName.mockReturnValue([validName, setName]); // valid
      const wrapper = mountWithQueryClient(RegisterDelegateForm, props);
      wrapper.find('button.confirm-btn').simulate('click');
      expect(props.nextStep).toHaveBeenCalledWith(rawTx);
    });
  });
});
