import { mountWithRouter } from 'src/utils/testHelpers';
import mockWallet from '../../../../../tests/constants/wallets';
import WalletVisualWithAddress from '.';
import { truncateTransactionID } from '../../utils/account';

describe('WalletVisualWithAddress component', () => {
  const props = {
    showBookmarkedAddress: true,
    transactionSubject: 'senderId',
    address: '283470127032187L',
    bookmarks: {
      LSK: [
        {
          title: 'BM',
          address: '283470127032187L',
        },
      ],
    },
  };

  it('should show bookmarked name if address is bookmarked', () => {
    const wrapper = mountWithRouter(WalletVisualWithAddress, props);
    expect(wrapper.find('.accountAddress').at(0)).toHaveText('BM');
  });

  it('should show account name', () => {
    const wrapper = mountWithRouter(WalletVisualWithAddress, { ...props, accountName: 'test' });
    expect(wrapper.find('.accountName').at(0)).toHaveText('test');
  });

  it('should show account name', () => {
    const wrapper = mountWithRouter(WalletVisualWithAddress, {
      ...props,
      accountName: 'test',
      publicKey: mockWallet.genesis.summary.publicKey,
    });
    wrapper.find('.accountName').at(0).simulate('mouseover');
    expect(wrapper.find('.pubkey').at(0)).toHaveText(
      `Public key:${truncateTransactionID(mockWallet.genesis.summary.publicKey)}`
    );
  });
});
