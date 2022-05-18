import React from 'react';
import { mount } from 'enzyme';
import { MODULE_ASSETS_NAME_ID_MAP } from '@transaction/configuration/moduleAssets';
import { mountWithRouter } from 'src/utils/testHelpers';
import { truncateAddress } from '@wallet/utils/account';
import wallets from '@tests/constants/wallets';
import * as delegateApi from '@dpos/validator/api';
import TransactionDetails from '.';

jest.mock('@dpos/validator/api', () => ({
  getDelegates: jest.fn(),
}));

const transferTx = {
  data: {
    id: '6efc4dcc36f35e0507cf910630aee301b4a31cbadcaf397f23bef728c3fd634e',
    moduleAssetId: '2:0',
    moduleAssetName: 'token:transfer',
    fee: '1000000',
    height: 619766,
    nonce: '31',
    block: {
      id: 'd72efadca080c1bffbc4bfaf4f531e719d6faf2d72ed8b3b32551ff3111c6139',
      height: 619766,
      timestamp: 1616604447,
    },
    sender: {
      address: 'lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y99',
      publicKey: 'b1d6bc6c7edd0673f5fed0681b73de6eb70539c21278b300f07ade277e1962cd',
    },
    signatures: [
      '9948f4378d3ef3c8c1f1e1ba2e84f116e9d077ffb167e50e2ed78a69253f3a3eb210425d08dd68042b2deda869679063578667c530d5e8c52835d1980b9b2a0a',
    ],
    asset: {
      amount: '150000000000',
      recipient: {
        address: 'lskdxc4ta5j43jp9ro3f8zqbxta9fn6jwzjucw7yt',
      },
      data: '',
    },
    isPending: false,
  },
};

const voteTx = {
  data: {
    id: 'fde8186c272fe8b513faa9e8816e23d6ec9dab883d15c984dbf543681548b595',
    moduleAssetId: '5:1',
    moduleAssetName: 'dpos:voteDelegate',
    fee: '30000000',
    height: 134,
    nonce: '2',
    block: {
      id: 'b4004afec4c466259ed929c1cbd64de794db13ee8a831129029e1b15ac9f4fb5',
      height: 134,
      timestamp: 1615972897,
    },
    sender: {
      address: 'lske4ssr2k2k7cb2ue52gbmgaewqw5zj4tbkxbvog',
      publicKey: '316946b7412842d80ccf5e54cbce41b6085868ec307a75101ab2b280c97815f6',
      username: 'vksgmbhnjlgerjwfskhw',
    },
    signatures: [
      '32b9318e2e6c81b6125a6f4b88961e95702edeadc5d02887ac08b96bab67b5b393d73377d2e7662300ffc57196c02837b99b310ee447017658ab9b7929ab6304',
    ],
    asset: {
      votes: [
        {
          delegateAddress: 'lskehj8am9afxdz8arztqajy52acnoubkzvmo9cjy',
          amount: '-1000000000',
        },
      ],
    },
    isPending: false,
  },
};

const delegateRegTx = {
  data: {
    id: 'fe680a5cfba50acb66c135cc11e92808991c5679b1d5f78f6a777817c5c4157c',
    moduleAssetId: '5:0',
    moduleAssetName: 'dpos:registerDelegate',
    fee: '1500000000',
    height: 130,
    nonce: '0',
    block: {
      id: '9e42cd5974c07c385897f7a539977f24a0ba1233a2df30d8c44898826f18cef8',
      height: 130,
      timestamp: 1615972857,
    },
    sender: {
      address: 'lskd6yo4kkzrbjadh3tx6kz2qt5o3vy5zdnuwycmw',
      publicKey: 'ea62fbdd5731a748a63b593db2c22129462f47db0f066d4ed3fc70957a456ebc',
      username: 'testUsername',
    },
    signatures: [
      '7bceb31d6f4dbeae27c3dee1acf0f950381ba3933d74d8b60831ef960fd6f17e9b9c48e88ac4e33bd3015329978e85f03d53d4659bf352b2865a3d2ff56a650b',
    ],
    asset: {
      username: 'testUsername',
    },
    isPending: false,
  },
};

describe('Transaction Details Component', () => {
  const props = {
    t: v => v,
    title: 'Transaction details',
    activeToken: 'LSK',
    transaction: {
      data: {},
      isLoading: true,
    },
    wallet: wallets.genesis,
    containerStyle: 'some_style',
  };

  const propsWithTransferTx = {
    ...props,
    transaction: transferTx,
  };

  const popsWithVote = {
    ...props,
    transaction: voteTx,
  };

  const popsWithRegisterDelegate = {
    ...props,
    transaction: delegateRegTx,
  };

  const mockUseContext = (mockData = {}) => {
    jest.spyOn(React, 'useContext').mockImplementation(() => ({
      wallet: props.wallet,
      activeToken: props.activeToken,
      transaction: transferTx.data,
      ...mockData,
    }));
  };

  beforeEach(mockUseContext);

  describe('Transfer transactions', () => {
    it('Should render an empty div if the data is not loaded but there is no errors either', () => {
      const wrapper = mount(<TransactionDetails {...props} />);
      expect(wrapper.html()).toBe('<div></div>');
    });
    it('Should render transaction details after transaction loaded', () => {
      const wrapper = mount(<TransactionDetails {...propsWithTransferTx} />);
      expect(wrapper.find('header h1')).toHaveText('Transaction details');
      const expectedId = truncateAddress(transferTx.data.id);
      expect(wrapper.find('.tx-id .copy-title').first().text().trim()).toBe(expectedId);
    });

    it('Should render transfer transaction with message (LSK)', () => {
      const wrapper = mount(<TransactionDetails {...propsWithTransferTx} />);
      expect(wrapper).toContainMatchingElements(2, '.walletInfo');
      expect(wrapper.find('.walletInfo .sender-address').text()).toBe(transferTx.data.sender.address);
      expect(wrapper.find('.walletInfo .receiver-address').text()).toBe(transferTx.data.asset.recipient?.address);
      expect(wrapper).toContainExactlyOneMatchingElement('.tx-reference');
    });

    it('Should show the delegate name if the sender is a Lisk delegate', () => {
      const propsWithDelegate = {
        ...props,
        transaction: {
          ...transferTx,
          sender: {
            address: 'lske4ssr2k2k7cb2ue52gbmgaewqw5zj4tbkxbvog',
            publicKey: '316946b7412842d80ccf5e54cbce41b6085868ec307a75101ab2b280c97815f6',
            username: 'vksgmbhnjlgerjwfskhw',
          },
        },
      };
      const wrapper = mount(<TransactionDetails {...propsWithDelegate} />);
      expect(wrapper).not.toContain('genesis');
    });
  });

  describe('Delegate vote transaction', () => {
    it('Should render delegate vote details', async () => {
      mockUseContext({ transaction: voteTx.data });
      delegateApi.getDelegates.mockResolvedValue({ data: [wallets.delegate] });
      const wrapper = mount(<TransactionDetails {...popsWithVote} />);
      await delegateApi.getDelegates();
      expect(wrapper.find('.tx-added-votes')).toHaveLength(1);
      expect(wrapper.find('.vote-item-value').text()).toBe('-10 LSK');
      expect(wrapper.find('.vote-item-address').text()).toBe(wallets.delegate.dpos.delegate.username);
    });
  });

  describe('Register delegate transaction', () => {
    it('Should render register delegate details', () => {
      mockUseContext({ transaction: delegateRegTx.data });
      const wrapper = mount(<TransactionDetails {...popsWithRegisterDelegate} />);
      expect(wrapper.find('.hasName').contains('testUsername')).toBe(true);
    });
  });

  describe('No results', () => {
    it('Should render no result screen', () => {
      const trnx = {
        error: 'INVALID_REQUEST_PARAMETER',
        data: {},
      };
      mockUseContext({ ...trnx, transaction: {} });
      const wrapper = mountWithRouter(
        TransactionDetails,
        {
          ...props,
          transaction: trnx,
        },
      );
      expect(wrapper).toContainMatchingElement('NotFound');
      expect(wrapper.find('.not-found-state h3').text()).toBe('The transaction was not found.');
    });
  });

  describe('Unlock transaction', () => {
    it('Should render unlock LSK details', () => {
      const unlockTx = {
        data: {
          moduleAssetId: MODULE_ASSETS_NAME_ID_MAP.unlockToken,
          sender: {
            senderId: wallets.genesis.summary.address,
          },
          id: '123',
          asset: {
            unlockObjects: [
              {
                amount: 100,
              }, {
                amount: 20,
              },
              {
                amount: -10,
              },
            ],
          },
          title: 'unlockToken',
          block: { height: '1234567890' },
        },
      };

      mockUseContext({ transaction: unlockTx.data });
      const wrapper = mountWithRouter(
        TransactionDetails,
        { ...props, transaction: unlockTx },
        { id: transferTx.id },
      );
      expect(wrapper).toContainMatchingElement('.transaction-image');
      expect(wrapper.find('.tx-header').text()).toEqual('Unlock');
      expect(wrapper).toContainMatchingElement('.transaction-id');
      expect(wrapper).toContainMatchingElement('.tx-amount');
      expect(wrapper).toContainMatchingElement('.tx-fee');
    });
  });
});
