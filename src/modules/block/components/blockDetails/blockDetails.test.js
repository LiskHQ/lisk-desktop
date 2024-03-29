import { mountWithRouter, mountWithQueryClient } from 'src/utils/testHelpers';
import { truncateAddress } from '@wallet/utils/account';
import { mockTransactions } from '@transaction/__fixtures__';
import { useTransactions } from '@transaction/hooks/queries/useTransactions';
import BlockDetails from './blockDetails';

describe('BlockDetails page', () => {
  let wrapper;
  const props = {
    id: '62583548026761657985',
  };

  const resizeWindow = (x, y) => {
    window.innerWidth = x;
    window.innerHeight = y;
    window.dispatchEvent(new Event('resize'));
  };

  beforeEach(() => {
    wrapper = mountWithQueryClient(BlockDetails, props);
    jest.clearAllMocks();
  });

  it.skip('renders a page properly without errors', () => {
    expect(wrapper.find('h1').at(0)).toHaveText('Block details');
    expect(wrapper.find('label').at(0)).toHaveText('Block ID');
    expect(wrapper.find('span.copy-title').at(0)).toHaveText(
      truncateAddress(mockTransactions.data[5].id)
    );
    expect(wrapper.find('label').at(1)).toHaveText('Height');
    expect(wrapper.find('label').at(2)).toHaveText('Date');
    expect(wrapper.find('label').at(3)).toHaveText('Confirmations');
    expect(wrapper.find('label').at(4)).toHaveText('Version');
    expect(wrapper.find('label').at(5)).toHaveText('Generated by');
    expect(wrapper.find('label').at(6)).toHaveText('Total generated');
    expect(wrapper.find('label').at(7)).toHaveText('Reward');
    expect(wrapper.find('label').at(8)).toHaveText('Total burnt');
    expect(wrapper.find('label').at(9)).toHaveText('Total fee');
    resizeWindow(1000, 500);
  });

  it.skip('renders a page with error', () => {
    const newProps = {
      ...props,
      id: '1402204103046409640',
    };
    wrapper = mountWithQueryClient(BlockDetails, newProps);
    expect(wrapper.find('h1').at(0)).toHaveText('Block details');
    expect(wrapper).toContainMatchingElement('Feedback');
    expect(wrapper.find('span').at(0)).toHaveText('Failed to load block details.');
  });

  // skipped because this test should have been covered by BlockDetailsTransactions.test.js
  it.skip('renders a page with transaction list', () => {
    wrapper = mountWithRouter(BlockDetails, props);
    expect(wrapper.find('TransactionRow')).toHaveLength(0);

    const newProps = {
      ...props,
      blockTransactions: {
        ...props.blockTransactions,
        isLoading: false,
        data: mockTransactions,
      },
    };
    wrapper = mountWithRouter(BlockDetails, newProps);
    expect(wrapper.find('TransactionRow')).toHaveLength(mockTransactions.length);
  });

  it.skip('shows a message when empty transactions response', () => {
    useTransactions.mockReturnValue({
      data: {},
    });
    const newProps = {
      ...props,
      id: '1402204103046404096',
    };
    wrapper = mountWithQueryClient(BlockDetails, newProps);
    expect(wrapper.find('Empty')).toHaveLength(1);
  });
});
