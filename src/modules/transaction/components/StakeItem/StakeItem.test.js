import { mountWithRouter } from 'src/utils/testHelpers';
import { truncateAddress } from '@wallet/utils/account';
import StakeItem from '.';

jest.mock('@wallet/utils/account');

describe('StakeItem', () => {
  it('should render correctly', () => {
    const props = {
      stake: {
        confirmed: '10',
      },
      address: 'lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y11',
      truncate: true,
    };
    const wrapper = mountWithRouter(StakeItem, props);
    expect(wrapper).toBeDefined();
    expect(wrapper).toContainMatchingElement('.stake-item-address');
    expect(wrapper).toContainMatchingElement('TokenAmount');
    expect(truncateAddress).toHaveBeenCalled();
  });
});
