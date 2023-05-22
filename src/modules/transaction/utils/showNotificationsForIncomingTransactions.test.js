import { toast } from 'react-toastify';
import mockSavedAccounts from '@tests/fixtures/accounts';
import { mockAppsTokens } from '@token/fungible/__fixtures__';
import { showNotificationsForIncomingTransactions } from './showNotificationsForIncomingTransactions';

jest.mock('react-toastify');

global.Notification = jest.fn().mockImplementation(() => ({
  close: jest.fn(),
}));
const mockToken = mockAppsTokens.data[0];

const txns = [
  {
    id: `ec2b25bafc284b064323ab12f391684eba8a89b4d8591f424e04bc5bb24e6233`,
    type: 0,
    moduleCommand: 'token:transfer',
    fee: '10000000',
    isPending: false,
    sender: { address: 'lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y11' },
    params: {
      amount: '200',
      recipientAddress: 'lsk8nxtxs9ekqc3c2jjtcsusmfj2498qyjbk35teh',
      data: 'test',
    },
    block: {
      timestamp: 106359314,
      height: 9381199,
    },
  },
  {
    id: `af2b25bafc284b068264ab12f132897eba8a89b4d8591f424e04bc5bb24e1980`,
    type: 0,
    moduleCommand: 'token:transfer',
    fee: '10000000',
    isPending: false,
    sender: { address: 'lskqw2b528hc6ud7y56toq3kmaq6kj2fpvf9amvtx' },
    params: {
      amount: '200',
      recipientAddress: 'lsk3ay4z7wqjczbo5ogcqxgxx23xyacxmycwxfh4d',
      data: '',
    },
    block: {
      timestamp: 106350086,
      height: 9381127,
    },
  },
];
const currAcct = mockSavedAccounts[0];

describe('showNotificationsForIncomingTransactions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should display notifications for transactions related to current account', () => {
    showNotificationsForIncomingTransactions(txns, currAcct, mockToken);

    expect(toast.info).toHaveBeenCalledTimes(1);
    expect(toast.info).toHaveBeenCalledWith('Your account just received 0.000002 LSK ');
  });

  it('should display notifications with additional info for transactions related to current account', () => {
    const updatedTxns = [...txns];
    updatedTxns[1] = {
      id: `bd2b83bafc284b068264ab12f132897eba8a89b4d8591f424e04bc5bb24e5628`,
      type: 0,
      moduleCommand: 'token:transfer',
      fee: '10000000',
      isPending: false,
      sender: { address: 'lskqw2b528hc6ud7y56toq3kmaq6kj2fpvf9amvtx' },
      params: {
        amount: '150',
        recipientAddress: 'lsk3ay4z7wqjczbo5ogcqxgxx23xyacxmycwxfh4d',
        data: 'test',
      },
      block: {
        timestamp: 106359582,
        height: 9383851,
      },
    };
    showNotificationsForIncomingTransactions(updatedTxns, currAcct, mockToken);

    expect(toast.info).toHaveBeenCalledTimes(1);
    expect(toast.info).toHaveBeenCalledWith(
      'Your account just received 0.0000015 LSK with message test'
    );
  });

  it('should display notification with no value if the amount is zero', () => {
    const zeroAmtTxns = [
      {
        id: `bd2b83bafc284b068264ab12f132897eba8a89b4d8591f424e04bc5bb24e5628`,
        type: 0,
        moduleCommand: 'token:transfer',
        fee: '10000000',
        isPending: false,
        sender: { address: 'lskqw2b528hc6ud7y56toq3kmaq6kj2fpvf9amvtx' },
        params: {
          amount: '0',
          recipientAddress: 'lsk3ay4z7wqjczbo5ogcqxgxx23xyacxmycwxfh4d',
          data: 'test',
        },
        block: {
          timestamp: 106359582,
          height: 9383851,
        },
      },
    ];
    showNotificationsForIncomingTransactions(zeroAmtTxns, currAcct, mockToken);

    expect(toast.info).toHaveBeenCalledTimes(1);
    expect(toast.info).toHaveBeenCalledWith('You received tokens');
  });

  it('should display notification no notification for other tx types', () => {
    const zeroAmtTxns = [
      {
        id: `bd2b83bafc284b068264ab12f132897eba8a89b4d8591f424e04bc5bb24e5628`,
        type: 0,
        moduleCommand: 'pos:registerValidator',
        fee: '10000000',
        isPending: false,
        sender: { address: 'lskqw2b528hc6ud7y56toq3kmaq6kj2fpvf9amvtx' },
        params: {
          name: 'test',
        },
        block: {
          timestamp: 106359582,
          height: 9383851,
        },
      },
    ];
    showNotificationsForIncomingTransactions(zeroAmtTxns, currAcct, mockToken);
    expect(toast.info).toHaveBeenCalledTimes(0);
  });
});
