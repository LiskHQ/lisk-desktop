import { mountWithRouter } from 'src/utils/testHelpers';
import accounts from '@tests/constants/wallets';
import { truncateAddress } from '@wallet/utils/account';
import { useTokensBalance } from '@token/fungible/hooks/queries';
import { mockAppsTokens } from '@token/fungible/__fixtures__';
import Row from '.';
import { mockTransactions } from '../../__fixtures__';

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

// @TODO: this would be re-instated when work is done in re-instating
//  the transctions/validator domain
// const stake = {
//   moduleCommandID: '5:1',
//   params: {
//     stakes: [
//       {
//         amount: '2000000000',
//         validatorAddress: accounts.validator.summary.address,
//       },
//     ],
//   },
// };
// const registerValidator = {
//   moduleCommandID: '5:0',
//   params: {
//     validator: {
//       username: 'sample_username',
//     },
//   },
// };
const transfer = {
  moduleCommand: 'token:transfer',
  params: {
    recipient: {
      address: accounts.multiSig.summary.address,
    },
    amount: '10000000000',
    data: 'sample message',
  },
};

jest.mock('@token/fungible/hooks/queries');
useTokensBalance.mockReturnValue({ data: mockAppsTokens.data[0] });

describe('Transaction Row', () => {
  const t = (str) => str;
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
        data: mockTransactions.data[0],
        layout: 'full',
      };
      const wrapper = mountWithRouter(Row, props, {});
      expect(wrapper.find('Height').text()).toBe('8350681');
      expect(wrapper.find('Sender').text()).toBe(
        `${props.data.sender.name}${truncateAddress(props.data.sender.address)}`
      );
      expect(wrapper.find('Date').text()).toBe('23 Nov 197004:51 PM');
      expect(wrapper.find('Status')).toHaveLength(1);
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
      const wrapper = mountWithRouter(Row, props, {});
      expect(wrapper.find('Sender')).toHaveLength(0);
    });
  });

  // @TODO: this would be re-instated when work is done in re-instating
  //  the transctions/validator domain
  // describe('Stake', () => {
  //   it('Should render in full layout mode', () => {
  //     const props = {
  //       ...baseProps,
  //       data: {
  //         ...txBase,
  //         ...stake,
  //       },
  //       layout: 'full',
  //     };
  //     const wrapper = mountWithRouter(
  //       Row,
  //       props,
  //       {},
  //     );
  //     expect(wrapper.find('Amount').text()).toBe('-');
  //     expect(wrapper.find('Sender').
  //       text()).toBe(truncateAddress(accounts.genesis.summary.address));
  //     expect(wrapper.find('Recipient').text()).toBe('Stake');
  //     // We don't show the details in full mode
  //     expect(wrapper.find('Params')).toHaveLength(0);
  //   });

  //   it('Should render in hosted layout mode', () => {
  //     const props = {
  //       ...baseProps,
  //       data: {
  //         ...txBase,
  //         ...stake,
  //       },
  //       layout: 'hosted',
  //     };
  //     const wrapper = mountWithRouter(
  //       Row,
  //       props,
  //       {},
  //     );
  //     expect(wrapper.find('Amount').text()).toBe('-');
  //     expect(wrapper.find('Counterpart').text()).toBe('Stake');
  //     expect(wrapper.find('Sender')).toHaveLength(0);
  //     expect(wrapper.find('Recipient')).toHaveLength(0);
  //     expect(wrapper.find('Params').text()).toBe(
  //       `${truncateAddress(accounts.validator.summary.address)}20 LSK`,
  //     );
  //   });
  // });

  // @TODO: this would be re-instated when work is done in re-instating the transction domain
  // describe('Register validator', () => {
  //   it('Should render in full layout mode', () => {
  //     const props = {
  //       ...baseProps,
  //       data: {
  //         ...txBase,
  //         ...registerValidator,
  //       },
  //       layout: 'full',
  //     };
  //     const wrapper = mountWithRouter(
  //       Row,
  //       props,
  //       {},
  //     );
  //     expect(wrapper.find('Amount').text()).toBe('-');
  //     expect(wrapper.find('Sender').text())
  //     .toBe(truncateAddress(accounts.genesis.summary.address));
  //     expect(wrapper.find('Recipient').text()).toBe('Register validator');
  //     // We don't show the details in full mode
  //     expect(wrapper.find('Params')).toHaveLength(0);
  //   });

  //   it('Should render in hosted layout mode', () => {
  //     const props = {
  //       ...baseProps,
  //       data: {
  //         ...txBase,
  //         ...registerValidator,
  //       },
  //       layout: 'hosted',
  //     };
  //     const wrapper = mountWithRouter(
  //       Row,
  //       props,
  //       {},
  //     );
  //     expect(wrapper.find('Amount').text()).toBe('-');
  //     expect(wrapper.find('Counterpart').text()).toBe('Register validator');
  //     expect(wrapper.find('Sender')).toHaveLength(0);
  //     expect(wrapper.find('Recipient')).toHaveLength(0);
  //     expect(wrapper.find('Params').text()).toBe('sample_username');
  //   });
  // });
});
