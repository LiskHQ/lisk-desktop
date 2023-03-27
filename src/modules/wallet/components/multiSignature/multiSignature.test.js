import { mountWithRouter } from 'src/utils/testHelpers';
import accounts from '@tests/constants/wallets';
import Multisignature from './multiSignature';
import { multisignGroups, transactionsData } from './mockData';

describe('Multisignature wallet tab component', () => {
  let wrapper;

  const props = {
    t: (v) => v,
    host: accounts.genesis.address,
    multisignGroups,
    transactions: transactionsData,
  };

  beforeEach(() => {
    wrapper = mountWithRouter(Multisignature, props);
  });

  it('Should render properly', () => {
    const html = wrapper.html();
    expect(html).toContain('multisign-groups-table');
    expect(html).toContain('transactions-table');
    expect(html).toContain('multisign-group-row');
    expect(html).toContain('multisign-transaction-row');

    expect(wrapper.find('div.multisign-transaction-row').length).toEqual(props.transactions.length);
    expect(wrapper.find('a.multisign-group-row').length).toEqual(props.multisignGroups.length);
  });
});
