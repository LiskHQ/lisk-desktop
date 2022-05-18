import { mountWithRouter } from 'src/utils/testHelpers';
import accounts from '@tests/constants/wallets';
import { truncateAddress } from '@wallet/utils/account';
import Row from '.';

const txBase = {
  sender: { address: accounts.genesis.summary.address },
  nonce: '100',
  fee: '142000',
  signatures: [
    'bbd659c908a609e27b491aeb429038fa8638b7eaed357043e5fbd463658caf7e9777b8b53f3d5e3ef4b6280e55d264b30162319eee24c3844c7c65974200ed00',
  ],
  block: {
    timestamp: 106359314,
    height: 9381199,
  },
  id: 'ad0e0acbe8a3ece3087c8362149ca39c470e565d268df32e57de5d3fe2e1ea5c',
};

const vote = {
  moduleAssetId: '5:1',
  asset: {
    votes: [
      {
        amount: '2000000000',
        delegateAddress: accounts.delegate.summary.address,
      },
    ],
  },
};
const registerDelegate = {
  moduleAssetId: '5:0',
  asset: {
    delegate: {
      username: 'sample_username',
    },
  },
};
const transfer = {
  moduleAssetId: '2:0',
  asset: {
    recipient: {
      address: accounts.multiSig.summary.address,
    },
    amount: '10000000000',
    data: 'sample message',
  },
};

describe('Transaction Row', () => {
  const t = str => str;
  const avatarSize = 40;
  const activeToken = 'LSK';
  const currentBlockHeight = 14000000;
  const host = accounts.genesis.summary.address;
  const baseProps = {
    className: '',
    t,
    currentBlockHeight,
    host,
    avatarSize,
    activeToken,
  };

  describe('Transfer', () => {
    it('Should render in full layout mode', () => {
      const props = {
        ...baseProps,
        data: {
          ...txBase,
          ...transfer,
        },
        layout: 'full',
      };
      const wrapper = mountWithRouter(
        Row,
        props,
        {},
      );
      expect(wrapper.find('Amount').text()).toBe('- 100 LSK');
      expect(wrapper.find('Sender').text()).toBe(truncateAddress(accounts.genesis.summary.address));
      expect(wrapper.find('Recipient').text()).toBe(truncateAddress(accounts.multiSig.summary.address));
      // We don't show the details in full mode
      expect(wrapper.find('Assets')).toHaveLength(0);
    });

    it('Should render in hosted layout mode', () => {
      const props = {
        ...baseProps,
        data: {
          ...txBase,
          ...transfer,
        },
        layout: 'hosted',
      };
      const wrapper = mountWithRouter(
        Row,
        props,
        {},
      );
      expect(wrapper.find('Amount').text()).toBe('- 100 LSK');
      expect(wrapper.find('Counterpart').text()).toBe(truncateAddress(accounts.multiSig.summary.address));
      expect(wrapper.find('Sender')).toHaveLength(0);
      expect(wrapper.find('Recipient')).toHaveLength(0);
      expect(wrapper.find('Assets').text()).toBe('sample message');
    });
  });

  describe('Vote', () => {
    it('Should render in full layout mode', () => {
      const props = {
        ...baseProps,
        data: {
          ...txBase,
          ...vote,
        },
        layout: 'full',
      };
      const wrapper = mountWithRouter(
        Row,
        props,
        {},
      );
      expect(wrapper.find('Amount').text()).toBe('-');
      expect(wrapper.find('Sender').text()).toBe(truncateAddress(accounts.genesis.summary.address));
      expect(wrapper.find('Recipient').text()).toBe('Vote');
      // We don't show the details in full mode
      expect(wrapper.find('Assets')).toHaveLength(0);
    });

    it('Should render in hosted layout mode', () => {
      const props = {
        ...baseProps,
        data: {
          ...txBase,
          ...vote,
        },
        layout: 'hosted',
      };
      const wrapper = mountWithRouter(
        Row,
        props,
        {},
      );
      expect(wrapper.find('Amount').text()).toBe('-');
      expect(wrapper.find('Counterpart').text()).toBe('Vote');
      expect(wrapper.find('Sender')).toHaveLength(0);
      expect(wrapper.find('Recipient')).toHaveLength(0);
      expect(wrapper.find('Assets').text()).toBe(
        `${truncateAddress(accounts.delegate.summary.address)}20 LSK`,
      );
    });
  });

  describe('Register delegate', () => {
    it('Should render in full layout mode', () => {
      const props = {
        ...baseProps,
        data: {
          ...txBase,
          ...registerDelegate,
        },
        layout: 'full',
      };
      const wrapper = mountWithRouter(
        Row,
        props,
        {},
      );
      expect(wrapper.find('Amount').text()).toBe('-');
      expect(wrapper.find('Sender').text()).toBe(truncateAddress(accounts.genesis.summary.address));
      expect(wrapper.find('Recipient').text()).toBe('Register delegate');
      // We don't show the details in full mode
      expect(wrapper.find('Assets')).toHaveLength(0);
    });

    it('Should render in hosted layout mode', () => {
      const props = {
        ...baseProps,
        data: {
          ...txBase,
          ...registerDelegate,
        },
        layout: 'hosted',
      };
      const wrapper = mountWithRouter(
        Row,
        props,
        {},
      );
      expect(wrapper.find('Amount').text()).toBe('-');
      expect(wrapper.find('Counterpart').text()).toBe('Register delegate');
      expect(wrapper.find('Sender')).toHaveLength(0);
      expect(wrapper.find('Recipient')).toHaveLength(0);
      expect(wrapper.find('Assets').text()).toBe('sample_username');
    });
  });
});
