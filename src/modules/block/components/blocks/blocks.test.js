import { mountWithQueryClient } from 'src/utils/testHelpers';
import useFilter from 'src/modules/common/hooks/useFilter';
import useSort from 'src/modules/common/hooks/useSort';
import { useBlocks } from '../../hooks/queries/useBlocks';
import Blocks from './blocks';
import { mockBlocks } from '../../__fixtures__';

jest.mock('../../hooks/queries/useBlocks');
jest.mock('src/modules/common/hooks/useFilter');
jest.mock('src/modules/common/hooks/useSort');

const mockApplyFilters = jest.fn();
const mockClearFilters = jest.fn();
const mockToggleSort = jest.fn();

describe('Blocks page', () => {
  const sort = 'height:desc';
  const height = '1234';
  const mockFetchNextPage = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders a page with header', () => {
    useBlocks.mockReturnValue({
      data: mockBlocks,
      isFetching: false,
      fetchNextPage: mockFetchNextPage,
      hasNextPage: false,
    });
    useFilter.mockReturnValue({
      filters: {},
      clearFilters: mockClearFilters,
      applyFilters: mockApplyFilters,
    });
    useSort.mockReturnValue({
      sort: '',
      toggleSort: mockToggleSort,
    });
    const wrapper = mountWithQueryClient(Blocks);
    expect(wrapper.find('.blocks-container h1')).toHaveText('All blocks');
  });

  it('renders table with blocks', () => {
    useBlocks.mockReturnValue({
      data: mockBlocks,
      isFetching: false,
      fetchNextPage: mockFetchNextPage,
      hasNextPage: false,
    });
    useFilter.mockReturnValue({
      filters: {},
      clearFilters: mockClearFilters,
      applyFilters: mockApplyFilters,
    });
    useSort.mockReturnValue({
      sort: '',
      toggleSort: mockToggleSort,
    });
    const wrapper = mountWithQueryClient(Blocks);
    expect(wrapper.find('a.blocks-row')).toHaveLength(mockBlocks.data.length);
  });

  it('allows to load more blocks', () => {
    useBlocks.mockReturnValue({
      data: { ...mockBlocks, data: mockBlocks.data.slice(0, 20) },
      isFetching: false,
      fetchNextPage: mockFetchNextPage,
      hasNextPage: true,
    });
    useFilter.mockReturnValue({
      filters: {},
      clearFilters: mockClearFilters,
      applyFilters: mockApplyFilters,
    });
    useSort.mockReturnValue({
      sort: '',
      toggleSort: mockToggleSort,
    });
    const wrapper = mountWithQueryClient(Blocks);
    wrapper.find('button.load-more').simulate('click');
    expect(mockFetchNextPage).toHaveBeenCalled();
  });

  it('shows error if API failed', () => {
    const error = 'Loading failed';
    useBlocks.mockReturnValue({
      error,
      data: { ...mockBlocks, data: mockBlocks.data.slice(0, 20) },
      isFetching: false,
      fetchNextPage: mockFetchNextPage,
      hasNextPage: true,
    });
    useFilter.mockReturnValue({
      filters: {},
      clearFilters: mockClearFilters,
      applyFilters: mockApplyFilters,
    });
    useSort.mockReturnValue({
      sort: '',
      toggleSort: mockToggleSort,
    });
    const wrapper = mountWithQueryClient(Blocks);
    expect(wrapper).toIncludeText(error);
  });

  it('allows to filter blocks by height and clear the filter', () => {
    useBlocks.mockReturnValue({
      data: mockBlocks,
      isFetching: false,
      fetchNextPage: mockFetchNextPage,
      hasNextPage: true,
    });
    useFilter.mockReturnValue({
      filters: { height },
      clearFilters: mockClearFilters,
      applyFilters: mockApplyFilters,
    });
    useSort.mockReturnValue({
      sort: '',
      toggleSort: mockToggleSort,
    });
    const wrapper = mountWithQueryClient(Blocks);
    wrapper.find('button.filter').simulate('click');
    wrapper.find('input.height').simulate('change', { target: { value: height } });
    wrapper.find('form.filter-container').simulate('submit');
    expect(mockApplyFilters).toHaveBeenCalledWith({
      dateFrom: undefined,
      dateTo: undefined,
      height,
    });
    wrapper.find('span.clear-filter').simulate('click');
    expect(mockClearFilters).toHaveBeenCalledWith(['height']);
  });

  it('allows to load more blocks when filtered', () => {
    useBlocks.mockReturnValue({
      data: { ...mockBlocks, data: mockBlocks.data.slice(0, 20) },
      isFetching: false,
      fetchNextPage: mockFetchNextPage,
      hasNextPage: true,
    });
    useFilter.mockReturnValue({
      filters: { height },
      clearFilters: mockClearFilters,
      applyFilters: mockApplyFilters,
    });
    useSort.mockReturnValue({
      sort: '',
      toggleSort: mockToggleSort,
    });
    const wrapper = mountWithQueryClient(Blocks);
    wrapper.find('button.filter').simulate('click');
    wrapper.find('input.height').simulate('change', { target: { value: height } });
    wrapper.find('form.filter-container').simulate('submit');

    wrapper.find('button.load-more').simulate('click');

    expect(mockFetchNextPage).toHaveBeenCalled();
  });

  it('allows to reverse sort by clicking height header', () => {
    useBlocks.mockReturnValue({
      data: { ...mockBlocks, data: mockBlocks.data.slice(0, 20) },
      isFetching: false,
      fetchNextPage: mockFetchNextPage,
      hasNextPage: true,
    });
    useFilter.mockReturnValue({
      filters: {},
      clearFilters: mockClearFilters,
      applyFilters: mockApplyFilters,
    });
    useSort.mockReturnValue({
      sort,
      toggleSort: mockToggleSort,
    });
    const wrapper = mountWithQueryClient(Blocks);

    wrapper.find('.sort-by.height').simulate('click');
    expect(mockToggleSort).toHaveBeenCalledWith('height');
  });
});
