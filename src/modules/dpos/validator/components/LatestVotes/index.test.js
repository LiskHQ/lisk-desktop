import { mountWithRouter } from 'src/utils/testHelpers';
import { delegateList } from '@tests/constants/delegates';
import { mockTransactions } from 'src/modules/transaction/__fixtures__';
import LatestVotes from './index';

const delegateDataList = delegateList(10);
const delegateData = Object.assign({}, ...delegateDataList);

const props = {
  votes: {
    isLoading: false,
    data: mockTransactions.data.slice(0, 10),
    loadData: jest.fn(),
    clearData: jest.fn(),
    urlSearchParams: {},
    meta: { total: delegateList.length, count: 10, offset: 0 },
  },
  t: (str) => str,
  delegates: { data: delegateData },
};

describe('Latest votes', () => {
  it('displays initial table of votes', () => {
    const wrapper = mountWithRouter(LatestVotes, props);
    expect(wrapper.find('.transactions-row').hostNodes()).toHaveLength(10);
  });

  it('can load more votes if possible', () => {
    const updatedDelegatesDataList = delegateList(30);
    const updatedDelegateData = Object.assign({}, ...updatedDelegatesDataList);
    const updatedProps = {
      ...props,
      votes: {
        ...props.votes,
        meta: { total: updatedDelegatesDataList.length, count: 10, offset: 0 },
      },
      delgates: { data: updatedDelegateData },
    };
    const wrapper = mountWithRouter(LatestVotes, updatedProps);
    expect(wrapper.find('.load-more')).toExist();
    wrapper.find('.load-more').first().simulate('click');
    expect(props.votes.loadData).toHaveBeenCalledTimes(1);
  });

  it('can not load more votes if meta property is unavailable', () => {
    const updatedDelegatesDataList = delegateList(30);
    const updatedDelegateData = Object.assign({}, ...updatedDelegatesDataList);
    const updatedProps = {
      ...props,
      votes: {
        ...props.votes,
        meta: {},
      },
      delgates: { data: updatedDelegateData },
    };
    delete updatedProps.votes.meta;
    const wrapper = mountWithRouter(LatestVotes, updatedProps);
    expect(wrapper.find('.load-more')).not.toExist();
  });
});
