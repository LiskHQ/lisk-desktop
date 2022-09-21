import { mountWithRouterAndQueryClient } from 'src/utils/testHelpers';
import Transactions from './index';

const props = {
  history: {
    push: jest.fn(),
  },
};

// The individual components have their respective unit tests hence a minimal test here
describe('Transactions', () => {
  it('renders the different sections properly', () => {
    const wrapper = mountWithRouterAndQueryClient(Transactions, props);
    expect(wrapper.find('Transactions overview')).toBeTruthy();
    expect(wrapper.find('All transactions')).toBeTruthy();
  });
});
