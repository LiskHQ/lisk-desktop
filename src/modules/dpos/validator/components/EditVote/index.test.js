import { mountWithRouterAndStore } from 'src/utils/testHelpers';
import EditVote from './index';

jest.mock('@transaction/api', () => ({
  getTransactionFee: jest.fn().mockImplementation(() => Promise.resolve({ value: '0.046' })),
}));

describe('EditVote', () => {
  it('Should render as addVote when we have not voted to this account yet', () => {
    const wrapper = mountWithRouterAndStore(
      EditVote, propsWithoutSearch, {}, { ...state, voting: noVote },
    );
    expect(wrapper.html()).toContain('Add vote');
    expect(wrapper.find('.confirm').exists()).toBeTruthy();
    expect(wrapper.find('.remove-vote').exists()).not.toBeTruthy();
  });
});
