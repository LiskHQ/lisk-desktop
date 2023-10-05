import { act } from 'react-dom/test-utils';
import { waitFor } from '@testing-library/react';
import { useTransactionEstimateFees } from '@transaction/hooks/queries/useTransactionEstimateFees';
import useSettings from '@settings/hooks/useSettings';
import { useAuth } from '@auth/hooks/queries';
import { mockAuth } from '@auth/__fixtures__';
import { getTransactionBaseFees, dryRunTransaction } from '@transaction/api';
import mockSavedAccounts from '@tests/fixtures/accounts';
import wallets from '@tests/constants/wallets';
import { mountWithQueryClient } from 'src/utils/testHelpers';
import Form, { validateState } from './index';

jest.mock('@transaction/api');
jest.mock('@account/hooks/useDeprecatedAccount', () => ({
  useDeprecatedAccount: jest.fn().mockReturnValue({
    isSuccess: true,
    isLoading: false,
  }),
}));

const mockCurrentAccount = mockSavedAccounts[0];
const mockEstimateFeeResponse = {
  data: {
    transaction: {
      fee: {
        tokenID: '0400000000000000',
        minimum: '5104000',
      },
    },
  },
  meta: {
    breakdown: {
      fee: {
        minimum: {
          byteFee: '96000',
          additionalFees: {},
        },
      },
    },
  },
};

jest.mock('@account/hooks', () => ({
  useCurrentAccount: jest.fn(() => [mockCurrentAccount]),
}));
jest.mock('@transaction/hooks/queries/useTransactionEstimateFees');
jest.mock('@settings/hooks/useSettings');
jest.mock('@auth/hooks/queries');
jest.mock('@token/fungible/hooks/queries/useTokenBalances', () => ({
  useTokenBalances: jest.fn(() => ({
    data: { data: [{ chainID: '04000000', symbol: 'LSK', availableBalance: 40000000 }] },
  })),
}));

useTransactionEstimateFees.mockReturnValue({
  data: mockEstimateFeeResponse,
  isFetching: false,
  isFetched: true,
  error: false,
});

useSettings.mockReturnValue({
  mainChainNetwork: { name: 'devnet' },
  toggleSetting: jest.fn(),
});
useAuth.mockReturnValue({ data: mockAuth });

const transactionBaseFees = {
  Low: 156,
  Medium: 100,
  High: 51,
};

getTransactionBaseFees.mockResolvedValue(transactionBaseFees);
dryRunTransaction.mockResolvedValue([]);

describe('Multisignature editor component', () => {
  let wrapper;
  const props = {
    account: wallets.genesis,
    nextStep: jest.fn(),
    authQuery: {
      isFetching: false,
      isFetched: true,
      data: {
        data: {
          numberOfSignatures: 1,
          mandatoryKeys: [],
          optionalKeys: [],
        },
      },
    },
  };

  beforeEach(() => {
    wrapper = mountWithQueryClient(Form, props);
  });

  it('renders properly', () => {
    expect(wrapper).toContainMatchingElement('header');
    expect(wrapper).toContainMatchingElement('ProgressBar');
    expect(wrapper).toContainMatchingElement('.multisignature-editor-input');
    expect(wrapper).toContainMatchingElement('.multisignature-members-controls');
    expect(wrapper).toContainMatchingElements(2, 'MemberField');
    expect(wrapper).toContainMatchingElement('TransactionPriority');
    expect(wrapper).toContainMatchingElement('footer');
  });

  it('renders properly when prevState is defined', () => {
    wrapper = mountWithQueryClient(Form, {
      ...props,
      prevState: {
        transactionJSON: {
          params: {
            mandatoryKeys: [{}, {}],
            optionalKeys: [{}, {}, {}],
            numberOfSignatures: 3,
          },
        },
      },
    });
    expect(wrapper.find('.multisignature-editor-input').at(0).props().value).toEqual(3);
    expect(wrapper).toContainMatchingElements(5, 'MemberField');
  });

  it('CTA is disabled when form is invalid', () => {
    expect(wrapper.find('.confirm-btn').at(0)).toBeDisabled();
  });

  it('can add no more than 64 members', () => {
    for (let i = 0; i < 62; ++i) {
      wrapper.find('.add-new-members').at(0).simulate('click');
    }

    expect(wrapper).toContainMatchingElements(64, 'MemberField');
    expect(wrapper.find('.add-new-members').at(0)).toBeDisabled();
  });

  it('delete icon is only visible if required signatures < members.length', () => {
    expect(wrapper).not.toContainMatchingElement('.delete-icon');
    for (let i = 0; i < 3; ++i) {
      wrapper.find('.add-new-members').at(0).simulate('click');
    }
    expect(wrapper).toContainMatchingElements(5, '.delete-icon');
  });

  it('clicking delete icon deletes a member field', () => {
    wrapper.find('.add-new-members').at(0).simulate('click');
    expect(wrapper).toContainMatchingElements(3, 'MemberField');
    wrapper.find('.delete-icon').at(0).simulate('click');
    wrapper.find('.select-optional').at(0).simulate('click');
    expect(wrapper).toContainMatchingElements(2, 'MemberField');
  });

  it('props.nextStep is called when the CTA is clicked', async () => {
    wrapper
      .find('input.msign-pk-input')
      .at(0)
      .simulate('change', { target: { value: wallets.genesis.summary.publicKey } });
    wrapper
      .find('input.msign-pk-input')
      .at(1)
      .simulate('change', { target: { value: wallets.validator.summary.publicKey } });
    act(() => {
      wrapper.update();
    });

    wrapper.find('.confirm-btn').at(0).simulate('click');

    await waitFor(() => {
      expect(props.nextStep).toHaveBeenCalledTimes(1);
    });
  });

  it('should render previous state correctly', () => {
    const propsWithPrev = {
      ...props,
      prevState: {
        transactionJSON: {
          params: {
            numberOfSignatures: 2,
            optionalKeys: [wallets.genesis.summary.publicKey],
            mandatoryKeys: [
              wallets.validator.summary.publicKey,
              wallets.multiSig.summary.publicKey,
            ],
          },
        },
      },
    };
    wrapper = mountWithQueryClient(Form, propsWithPrev);

    expect(wrapper.find('MemberField')).toHaveLength(3);
  });

  it('should be able to change the number of signatures', async () => {
    props.nextStep.mockReset();
    wrapper
      .find('.multisignature-editor-input input')
      .at(0)
      .simulate('change', { target: { value: 1 } });
    wrapper
      .find('input.msign-pk-input')
      .at(0)
      .simulate('change', { target: { value: wallets.genesis.summary.publicKey } });
    act(() => {
      wrapper.update();
    });
    wrapper.find('.confirm-btn').at(0).simulate('click');
    await waitFor(() => {
      expect(props.nextStep).toHaveBeenCalledTimes(1);
    });
  });
});

describe('validateState', () => {
  const commonParam = {
    t: (str) => str,
    currentAccount: mockCurrentAccount,
  };

  it('should return error if signature are less than mandatory members', () => {
    const pbk = wallets.genesis.summary.publicKey;
    const params = {
      ...commonParam,
      mandatoryKeys: [pbk, pbk, pbk],
      optionalKeys: [],
      numberOfSignatures: 2,
    };
    const error = 'Number of signatures must be equal to the number of members.';
    expect(validateState(params).messages).toContain(error);
  });

  it('should return error if signatures are more than all members', () => {
    const pbk = wallets.genesis.summary.publicKey;
    const params = {
      ...commonParam,
      mandatoryKeys: [pbk, pbk, pbk],
      optionalKeys: [],
      numberOfSignatures: 5,
    };
    const error = 'Number of signatures must be equal to the number of members.';
    expect(validateState(params).messages).toContain(error);
  });

  it('should return error if optional members are practically mandatory', () => {
    const pbk = wallets.genesis.summary.publicKey;
    const params = {
      ...commonParam,
      mandatoryKeys: [pbk, pbk, pbk],
      optionalKeys: [pbk],
      numberOfSignatures: 4,
    };
    const error =
      'Either change the optional member to mandatory or reduce the number of signatures.';
    expect(validateState(params).messages).toContain(error);
  });

  it('should return error if optional members never get to sign', () => {
    const pbk = wallets.genesis.summary.publicKey;
    const pbk2 = wallets.mainnet_guy.summary.publicKey;
    const pbk3 = wallets.multiSig_candidate.summary.publicKey;
    const pbk4 = wallets.validator.summary.publicKey;
    const params = {
      ...commonParam,
      mandatoryKeys: [pbk, pbk2, pbk3,],
      optionalKeys: [pbk4],
      numberOfSignatures: 2,
    };
    const error = 'Number of signatures must be above {{num}}.';
    expect(validateState(params).messages).toContain(error);
  });
  
  it('should return error if duplicate public key is used', () => {
    const pbk = wallets.genesis.summary.publicKey;
    const params = {
      ...commonParam,
      mandatoryKeys: [pbk, pbk, pbk],
      optionalKeys: [pbk],
      numberOfSignatures: 3,
    };
    const error = 'Duplicate public keys detected.';
    expect(validateState(params).messages).toContain(error);
  });

  it('should return error if there are only optional members', () => {
    const pbk = wallets.genesis.summary.publicKey;
    const params = {
      ...commonParam,
      mandatoryKeys: [],
      optionalKeys: [pbk, pbk, pbk],
      numberOfSignatures: 3,
    };
    const error = 'All members can not be optional. Consider changing them to mandatory.';
    expect(validateState(params).messages).toContain(error);
  });

  it('should return error if the number of signature is equal to optional and mandatory members', () => {
    const pbk = wallets.genesis.summary.publicKey;
    const params = {
      ...commonParam,
      mandatoryKeys: [pbk, pbk, pbk],
      optionalKeys: [pbk, pbk, pbk],
      numberOfSignatures: 6,
    };
    const error =
      'Either change the optional member to mandatory or reduce the number of signatures.';
    expect(validateState(params).messages).toContain(error);
  });

  it('should return error if there are more than 64 members', () => {
    const pbk = wallets.genesis.summary.publicKey;
    const params = {
      ...commonParam,
      mandatoryKeys: new Array(65).fill(pbk),
      optionalKeys: [],
      numberOfSignatures: 65,
    };
    const error = 'Maximum number of members is {{MAX_MULTI_SIG_MEMBERS}}.';
    expect(validateState(params).messages).toContain(error);
  });

  it('should return error if there are duplicate public keys', () => {
    const pbk = wallets.genesis.summary.publicKey;
    const params = {
      ...commonParam,
      mandatoryKeys: new Array(2).fill(pbk),
      optionalKeys: [],
      numberOfSignatures: 2,
    };
    const error = 'Duplicate public keys detected.';
    expect(validateState(params).messages).toContain(error);
  });
});
