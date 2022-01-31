import React from 'react';
import { mount } from 'enzyme';
import { MODULE_ASSETS_NAME_ID_MAP } from '@constants';
import { mountWithRouter } from '@utils/testHelpers';
import { truncateAddress } from '@utils/account';
import TransactionDetails from './transactionDetails';
import accounts from '../../../../test/constants/accounts';

const transaction = {
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

describe('Transaction Details Component', () => {
  const voteTransaction = {
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
            delegateAddress: '8a596a9591aca03d14a1bdba429cb106eb1447b6',
            amount: '-1000000000',
          },
        ],
      },
      isPending: false,
    },
  };

  const props = {
    t: v => v,
    title: 'Transaction details',
    history: {
      push: jest.fn(),
      replace: jest.fn(),
      createHref: jest.fn(),
    },
    activeToken: 'LSK',
    transaction: {
      data: {},
      isLoading: true,
    },
    delegates: {
      data: {},
      loadData: jest.fn(),
    },
    match: {
      url: `/transactions/${transaction.id}`,
    },
    votedDelegates: {
      data: {},
      loadData: jest.fn(),
    },
    account: accounts.genesis,
  };

  describe('Transfer transactions', () => {
    it('Should render transaction details after transaction loaded', () => {
      const wrapper = mountWithRouter(
        TransactionDetails,
        { ...props, transaction },
        { id: transaction.id },
      );
      expect(wrapper.find('header h1')).toHaveText('Transaction details');
      const expectedId = truncateAddress(transaction.data.id);
      expect(wrapper.find('.transaction-id .copy-title').first().text().trim()).toBe(expectedId);
    });

    it('Should load delegate names after vote transaction loading finished', () => {
      const wrapper = mountWithRouter(
        TransactionDetails,
        { ...props, transaction: voteTransaction },
        { id: transaction.id },
      );
      expect(wrapper.find('VoteItem')).toHaveLength(1);
    });

    it('Should render transfer transaction with message (LSK)', () => {
      const wrapper = mountWithRouter(
        TransactionDetails,
        { ...props, transaction },
        { id: transaction.id },
      );
      expect(wrapper).toContainMatchingElements(2, '.accountInfo');
      expect(wrapper.find('.accountInfo .sender-address').text()).toBe(transaction.data.sender.address);
      expect(wrapper.find('.accountInfo .receiver-address').text()).toBe(transaction.data.asset.recipient?.address);
      expect(wrapper).toContainExactlyOneMatchingElement('.tx-reference');
    });

    it('Should not render transfer transaction with message (BTC)', () => {
      const wrapper = mount(<TransactionDetails {...props} activeToken="BTC" />);
      expect(wrapper).not.toContain('.tx-reference');
    });

    it('Should show the delegate name if the sender is a Lisk delegate', () => {
      const delegateTx = {
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
                delegateAddress: '8a596a9591aca03d14a1bdba429cb106eb1447b6',
                amount: '-1000000000',
              },
            ],
          },
          isPending: false,
        },
      };
      const wrapper = mountWithRouter(
        TransactionDetails,
        { ...props, activeToken: 'BTC', transaction: delegateTx },
        { id: transaction.id },
      );
      expect(wrapper).not.toContain('genesis');
    });
  });

  describe('Delegate vote transaction', () => {
    it('Should render delegate vote details', () => {
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
                delegateAddress: '8a596a9591aca03d14a1bdba429cb106eb1447b6',
                amount: '-1000000000',
              },
            ],
          },
          isPending: false,
        },
      };
      const wrapper = mountWithRouter(
        TransactionDetails,
        { ...props, transaction: voteTx },
        { id: transaction.id },
      );
      expect(wrapper).toContainExactlyOneMatchingElement('.accountInfo');
      expect(wrapper.find('.accountInfo .label').text()).toBe('Voter');
    });
  });

  describe('Register delegate transaction', () => {
    it('Should render register delegate details', () => {
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
      const wrapper = mountWithRouter(
        TransactionDetails,
        { ...props, transaction: delegateRegTx },
        { id: transaction.id },
      );
      expect(wrapper).toContainExactlyOneMatchingElement('.accountInfo');
      expect(wrapper.find('.hasName').contains('testUsername')).toBe(true);
    });
  });

  describe('No results', () => {
    it('Should render no result screen', () => {
      const wrapper = mount(<TransactionDetails {...{
        ...props,
        transaction: {
          error: 'INVALID_REQUEST_PARAMETER',
          data: {},
        },
      }}
      />);
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
            senderId: accounts.genesis.summary.address,
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
      const wrapper = mountWithRouter(
        TransactionDetails,
        { ...props, transaction: unlockTx },
        { id: transaction.id },
      );
      expect(wrapper).toContainMatchingElement('.transaction-image');
      expect(wrapper.find('.tx-header').text()).toEqual('Unlock');
      expect(wrapper).toContainMatchingElement('.transaction-id');
      expect(wrapper).toContainMatchingElement('.tx-amount');
      expect(wrapper).toContainMatchingElement('.tx-fee');
    });
  });
});
