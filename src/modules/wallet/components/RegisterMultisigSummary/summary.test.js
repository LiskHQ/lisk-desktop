import React from 'react';
import { cryptography } from '@liskhq/lisk-client';
import { mount } from 'enzyme';
import * as hwManager from '@transaction/utils/hwManager';
import accounts from '@tests/constants/wallets';
import { mockAuth } from 'src/modules/auth/__fixtures__';
import { useAuth } from 'src/modules/auth/hooks/queries';
import mockSavedAccounts from '@tests/fixtures/accounts';
import { useCommandSchema } from '@network/hooks/useCommandsSchema';
import { mockCommandParametersSchemas } from 'src/modules/common/__fixtures__';
import Summary from './Summary';

const mockedCurrentAccount = mockSavedAccounts[0];

jest.mock('@auth/hooks/queries');
jest.mock('@network/hooks/useCommandsSchema');
jest.mock('@account/hooks', () => ({
  useCurrentAccount: jest.fn(() => [mockedCurrentAccount, jest.fn()]),
}));

const mockTransaction = {
  fee: BigInt(10000),
  mandatoryKeys: [
    Buffer.from('0fe9a3f1a21b5530f27f87a414b549e79a940bf24fdf2b2f05e7f22aeeecc86a', 'hex'),
    Buffer.from('86499879448d1b0215d59cbf078836e3d7d9d2782d56a2274a568761bff36f19', 'hex'),
  ],
  numberOfSignatures: 2,
  optionalKeys: [],
};
const address = 'lskdxc4ta5j43jp9ro3f8zqbxta9fn6jwzjucw7yt';

jest.mock('@transaction/api/index', () => ({
  create: jest.fn(() => Promise.resolve(mockTransaction)),
  computeTransactionId: jest.fn(() => mockTransaction.id),
}));
jest.mock('@transaction/utils/hwManager');
jest.spyOn(cryptography.address, 'getLisk32AddressFromPublicKey').mockReturnValue(address);

describe('Multisignature Summary component', () => {
  const mandatoryKeys = [accounts.genesis, accounts.delegate].map((item) => item.summary.publicKey);

  let wrapper;
  const props = {
    t: (v) => v,
    prevStep: jest.fn(),
    nextStep: jest.fn(),
    multisigTransactionSigned: jest.fn(),
    transactions: {
      signedTransaction: {
        module: 'auth',
        command: 'registerMultisignature',
        senderPublicKey: Buffer.from(accounts.genesis.summary.publicKey, 'hex'),
        nonce: BigInt(49),
        fee: BigInt(2000000),
        signatures: [
          '',
          Buffer.from(
            'd8a75de09db6ea245c9ddba429956e941adb657024fd01ae3223620a6da2f5dada722a2fc7f8a0c795a2bde8c4a18847b1ac633b21babbf4a628df22f84c5600',
            'hex'
          ),
        ],
        params: {
          numberOfSignatures: 2,
          mandatoryKeys,
          optionalKeys: [],
        },
        id: Buffer.from('7c98f8f3a042000abac0d1c38e6474f0571347d9d2a25929bcbac2a29747e31d', 'hex'),
      },
    },
    transactionJSON: {
      fee: 2000000,
      nonce: 49,
      module: 'auth',
      command: 'registerMultisignature',
      senderPublicKey: accounts.genesis.summary.publicKey,
      params: {
        numberOfSignatures: 2,
        mandatoryKeys,
        optionalKeys: [],
      },
    },
    formProps: {
      moduleCommand: 'auth:registerMultisignature',
    },
  };

  beforeEach(() => {
    wrapper = mount(<Summary {...props} />);
    hwManager.signTransactionByHW.mockResolvedValue({});
  });

  useAuth.mockReturnValue({ data: mockAuth });
  useCommandSchema.mockReturnValue(
    mockCommandParametersSchemas.data.reduce(
      (result, { moduleCommand, schema }) => ({ ...result, [moduleCommand]: schema }),
      {}
    )
  );

  it('Should call props.nextStep', async () => {
    wrapper.find('.confirm-button').at(0).simulate('click');
    const { transactionJSON, formProps } = props;
    expect(props.nextStep).toHaveBeenCalledWith({
      formProps,
      transactionJSON,
      sender: { ...mockedCurrentAccount },
    });
  });

  it('Should call props.prevStep', () => {
    wrapper.find('.cancel-button').at(0).simulate('click');
    expect(props.prevStep).toBeCalled();
  });

  it('Should render properly', () => {
    expect(wrapper.find('.member-info').length).toEqual(
      props.transactionJSON.params.mandatoryKeys.length +
        props.transactionJSON.params.optionalKeys.length
    );
    expect(wrapper.find('.info-fee').at(0).text()).toContain('0.02 LSK');
  });

  it('Should not call props.nextStep when signedTransaction is empty', () => {
    jest.clearAllMocks();

    const newProps = {
      ...props,
      transactions: {
        ...props.transactions,
        signedTransaction: {},
      },
    };
    wrapper = mount(<Summary {...newProps} />);
    expect(props.nextStep).not.toHaveBeenCalledWith();
  });
});
