import { mountWithRouter } from 'src/utils/testHelpers';
import { delegateList } from '@tests/constants/delegates';
import { votesList } from '@tests/constants/votes';
import LatestVotes from './index';

const delegateDataList = delegateList(10);
const delegateData = Object.assign({}, ...delegateDataList);

const props = {
  votes: {
    isLoading: false,
    data: votesList,
    loadData: jest.fn(),
    clearData: jest.fn(),
    urlSearchParams: {},
    meta: { total: delegateList.length, count: 10, offset: 0 },
  },
  t: str => str,
  delegates: { data: delegateData },
};

describe('Latest votes', () => {
  it('displays initial table of votes', () => {
    const wrapper = mountWithRouter(LatestVotes, props);
    expect(wrapper.find('.transaction-row-wrapper')).toHaveLength(10);
  });
});
