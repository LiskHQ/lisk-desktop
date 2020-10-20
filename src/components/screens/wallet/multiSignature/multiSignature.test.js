import { mountWithRouter } from '../../../../utils/testHelpers';
import Multisignature from './multiSignature';
import accounts from '../../../../../test/constants/accounts';

describe('Multisignature wallet tab component', () => {
  let wrapper;

  const props = {
    t: v => v,
    host: accounts.genesis,
  };

  it('Should render properly', () => {
    wrapper = mountWithRouter(Multisignature, props);
    const html = wrapper.html();
    expect(html).toContain('transactions-table');
    expect(html).toContain('transactions-row');
  });
});
