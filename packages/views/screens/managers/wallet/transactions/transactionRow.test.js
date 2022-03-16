import { mountWithRouter } from '@utils/testHelpers';
import TransactionRow from './transactionRow';
import accounts from '../../../../../test/constants/accounts';

describe('Single Transaction Component', () => {
  const unlockTx = {
    data: {
      sender: {
        address: accounts.genesis.summary.address,
      },
      block: {
        timestamp: 1617806451178,
      },
      asset: {
        unlockObjects: [
          {
            amount: '80000000000',
            unvoteHeight: 34482,
            delegateAddress: 'lskewvoradpj2zheu8jkouqt97ee3548s683xqv56',
          },
        ],
      },
      confirmation: 1,
      moduleAssetId: '5:2',
      id: 123,
      fee: 1e7,
      timestamp: Date.now(),
    },
  };

  it('Should render unlock LSK details', () => {
    const wrapper = mountWithRouter(
      TransactionRow,
      {
        t: v => v,
        host: accounts.genesis.summary.address,
        data: unlockTx.data,
      },
    );
    expect(wrapper).toContainMatchingElement('.transaction-image');
    expect(wrapper.find('.transaction-address').text()).toEqual('Unlock');
    expect(wrapper).toContainMatchingElement('.transaction-amount');
  });
});
