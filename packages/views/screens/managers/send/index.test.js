import { getTransactionBaseFees, getTransactionFee } from '@transaction/api';
import { mountWithRouter } from '@common/utilities/testHelpers';
import wallets from '@tests/constants/wallets';
import Send from './index';

jest.mock('@transaction/api');

getTransactionBaseFees.mockResolvedValue({
  Low: 0,
  Medium: 1000,
  High: 2000,
});

getTransactionFee.mockResolvedValue({
  value: 0.1,
  error: false,
  feedback: '',
});

const props = {
  settings: { currency: 'USD' },
  settingsUpdated: () => {},
  wallet: {
    token: { balance: wallets.genesis.balance },
  },
  t: v => v,
  prevState: {
    fields: {},
  },
  bookmarks: {
    LSK: [{
      title: 'ABC',
      address: '12345L',
      balance: 10,
    },
    {
      title: 'FRG',
      address: '12375L',
      balance: 15,
    },
    {
      title: 'KTG',
      address: '12395L',
      balance: 7,
    }],
  },
  history: {
    location: {
      path: '/wallet/send/send',
      search: '?recipient=16313739661670634666L&amount=10&reference=test',
    },
    push: jest.fn(),
  },
  initialValue: {},
};

describe('Send', () => {
  it('should render properly getting data from URL', () => {
    const wrapper = mountWithRouter(Send, props);
    expect(wrapper).toContainMatchingElement('Dialog');
    expect(wrapper).toContainMatchingElement('MultiStep');
    expect(wrapper).toContainMatchingElement('Form');
    expect(wrapper).not.toContainMatchingElement('Summary');
    expect(wrapper).not.toContainMatchingElement('TransactionStatus');
  });

  it('should render properly without getting data from URL', () => {
    const newProps = { ...props };
    newProps.history.location.path = '';
    newProps.history.location.search = '';
    const wrapper = mountWithRouter(Send, newProps);
    wrapper.update();
    expect(wrapper).toContainMatchingElement('Dialog');
    expect(wrapper).toContainMatchingElement('MultiStep');
    expect(wrapper).toContainMatchingElement('Form');
  });
});
