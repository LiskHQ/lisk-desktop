import React from 'react';
import { cryptography } from '@liskhq/lisk-client';
import { mount } from 'enzyme';
import { removeSearchParamsFromUrl } from 'src/utils/searchParams';
import wallets from '@tests/constants/wallets';
import { mockAuth } from '@auth/__fixtures__';
import useTxInitiatorAccount from '@transaction/hooks/useTxInitiatorAccount';
import mockBlockchainApplications from '@tests/fixtures/blockchainApplicationsManage';
import { MODULE_COMMANDS_NAME_MAP } from 'src/modules/transaction/configuration/moduleCommand';
import blockchainApplicationsExplore from '@tests/fixtures/blockchainApplicationsExplore';
import { mockAppsTokens, mockTokensBalance } from 'src/modules/token/fungible/__fixtures__';
import Summary from './summary';

const address = 'lskdxc4ta5j43jp9ro3f8zqbxta9fn6jwzjucw7yt';
jest.spyOn(cryptography.address, 'getLisk32AddressFromPublicKey').mockReturnValue(address);

jest.mock('src/utils/searchParams', () => ({
  ...jest.requireActual('src/utils/searchParams'),
  removeSearchParamsFromUrl: jest.fn(),
}));

jest.mock('@transaction/utils/transaction', () => ({
  getTotalSpendingAmount: () => '1000000000',
}));
jest.mock('@transaction/hooks/useTxInitiatorAccount');

describe('Sign Multisignature Tx Review component', () => {
  let wrapper;
  const props = {
    t: (v) => v,
    account: {
      summary: {
        mandatoryKeys: wallets.multiSig.keys.mandatoryKeys,
        optionalKeys: wallets.multiSig.keys.optionalKeys,
        publicKey: '35c6b25520fc868b56c83fed6e1c89bb350fb7994a5da0bcea7a4f621f948c7f',
      },
    },
    activeToken: mockAppsTokens.data[0],
    networkIdentifier: 'sample_identifier',
    nextStep: jest.fn(),
    history: {},
    error: undefined,
    senderAccount: { data: wallets.multiSig },

    formProps: {
      isValid: true,
      moduleCommand: MODULE_COMMANDS_NAME_MAP.transfer,
      composedFees: { Transaction: '1 LSK', CCM: '1 LSK', Initialisation: '1 LSK' },
      fields: {
        sendingChain: mockBlockchainApplications[0],
        recipientChain: blockchainApplicationsExplore[0],
        token: mockTokensBalance.data[0],
        recipient: {
          address: wallets.genesis.summary.address,
          title: 'test title',
        },
      },
    },
    transactionJSON: {
      command: 'transfer',
      fee: '196000',
      module: 'token',
      nonce: '0',
      params: {
        amount: '100000000',
        data: 'we have some information is here',
        recipientAddress: '00b1182b317a82e4b9c4a54119ced29f19b496de',
        tokenID: '0000000200000001',
      },
      senderPublicKey: '35c6b25520fc868b56c83fed6e1c89bb350fb7994a5da0bcea7a4f621f948c7f',
      signatures: [wallets.multiSig.summary.publicKey, '', ''],
    },
  };

  beforeEach(() => {
    wrapper = mount(<Summary {...props} />);
  });

  useTxInitiatorAccount.mockReturnValue({
    txInitiatorAccount: {
      ...mockAuth.data,
      ...mockAuth.meta,
      keys: {
        ...mockAuth.data,
        mandatoryKeys: wallets.multiSig.keys.mandatoryKeys,
        optionalKeys: wallets.multiSig.keys.optionalKeys,
      },
    },
    isLoading: false,
  });

  it('Should call props.nextStep passing the signed transaction', () => {
    wrapper = mount(<Summary {...props} />);
    const { transactionJSON, formProps } = props;
    const signatures = props.transactionJSON.signatures;
    signatures[1] = wallets.genesis.summary.publicKey;

    wrapper.find('button.sign').simulate('click');

    expect(props.nextStep).toHaveBeenCalledWith(
      expect.objectContaining({
        formProps,
        transactionJSON,
        sender: {
          ...mockAuth.data,
          ...mockAuth.meta,
          keys: {
            ...mockAuth.data,
            mandatoryKeys: wallets.multiSig.keys.mandatoryKeys,
            optionalKeys: wallets.multiSig.keys.optionalKeys,
          },
        },
        signatureStatus: 'overSigned',
      })
    );
  });

  it('Should call props.prevStep', () => {
    wrapper = mount(<Summary {...props} />);
    wrapper.find('button.reject').simulate('click');
    expect(removeSearchParamsFromUrl).toHaveBeenCalledWith(props.history, ['modal']);
  });

  it('Should render properly when signing register multi-signature tx', () => {
    const newProps = {...props, transactionJSON: {
      ...props.transactionJSON,
      module: 'auth',
      command: 'registerMultisignature',
      params: {
        mandatoryKeys: [
          'a3f96c50d0446220ef2f98240898515cbba8155730679ca35326d98dcfb680f0',
          'cf434a889d6c7a064e8de61bb01759a76f585e5ff45a78ba8126ca332601f535',
        ],
        optionalKeys: [],
        numberOfSignatures: 2,
        signatures: [
          Buffer.from(
            'ed058b6c067f9f5a55a83c38e02975931214de6f86aeb15179fb71f2f751412a82e5bad8bd0d5e25f493c445db978a687ca097c190d1e6042043133880dbdc0f'
          ),
          Buffer.from(
            'dac33aedad70b2e1329c3f0b241769bcf5ac5ec2494081910e54c2107a61ec2a56d1d1ac6c5814416288911fe87906b35ec0b9fd77df44c698857d56053af504'
          ),
        ],
      }
    }}
    wrapper = mount(<Summary {...newProps} />);
    const { params } = newProps.transactionJSON;
    const expectedLength = params.mandatoryKeys.length + params.optionalKeys.length;
    const html = wrapper.html();
    expect(wrapper).toContainMatchingElements(expectedLength, '.member-info');
    expect(html).toContain('0.00196 LSK');
  });

  it('Should render properly when senderAccount is empty', () => {
    useTxInitiatorAccount.mockReturnValue({
      txInitiatorAccount: {},
    });
    wrapper = mount(<Summary {...props} />);
    const html = wrapper.html();
    expect(html).toEqual('<div></div>');
  });
});
