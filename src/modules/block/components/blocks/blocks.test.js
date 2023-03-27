import { mountWithQueryClient } from 'src/utils/testHelpers';
import { useBlocks } from '../../hooks/queries/useBlocks';
import Blocks from './blocks';
import { mockBlocks } from '../../__fixtures__';

jest.mock('../../hooks/queries/useBlocks');

describe('Blocks page', () => {
  let props;
  const sort = 'height:desc';
  const height = '1234';
  const mockFetchNextPage = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    props = {
      filters: {},
      applyFilters: jest.fn(),
      clearFilter: jest.fn(),
      changeSort: jest.fn(),
    };
  });

  it('renders a page with header', () => {
    useBlocks.mockReturnValue({
      data: mockBlocks,
      isFetching: false,
      fetchNextPage: mockFetchNextPage,
      hasNextPage: false,
    });
    const wrapper = mountWithQueryClient(Blocks, props);
    expect(wrapper.find('.blocks-container h1')).toHaveText('All blocks');
  });

  it('renders table with blocks', () => {
    useBlocks.mockReturnValue({
      data: mockBlocks,
      isFetching: false,
      fetchNextPage: mockFetchNextPage,
      hasNextPage: false,
    });
    const wrapper = mountWithQueryClient(Blocks, props);
    expect(wrapper.find('a.blocks-row')).toHaveLength(mockBlocks.data.length);
  });

  it('allows to load more blocks', () => {
    useBlocks.mockReturnValue({
      data: { ...mockBlocks, data: mockBlocks.data.slice(0, 20) },
      isFetching: false,
      fetchNextPage: mockFetchNextPage,
      hasNextPage: true,
    });
    const wrapper = mountWithQueryClient(Blocks, { ...props });
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
    const wrapper = mountWithQueryClient(Blocks, props);
    expect(wrapper).toIncludeText(error);
  });

  it('allows to filter blocks by height and clear the filter', () => {
    useBlocks.mockReturnValue({
      data: mockBlocks,
      isFetching: false,
      fetchNextPage: mockFetchNextPage,
      hasNextPage: true,
    });
    props.filters = {
      height,
    };
    const wrapper = mountWithQueryClient(Blocks, props);
    wrapper.find('button.filter').simulate('click');
    wrapper.find('input.height').simulate('change', { target: { value: height } });
    wrapper.find('form.filter-container').simulate('submit');
    expect(props.applyFilters).toHaveBeenCalledWith(
      {
        dateFrom: undefined,
        dateTo: undefined,
        height,
      },
      null,
      expect.any(Function)
    );
    wrapper.find('span.clear-filter').simulate('click');
    expect(props.clearFilter).toHaveBeenCalledWith('height', expect.any(Function));
  });

  it('allows to load more blocks when filtered', () => {
    useBlocks.mockReturnValue({
      data: { ...mockBlocks, data: mockBlocks.data.slice(0, 20) },
      isFetching: false,
      fetchNextPage: mockFetchNextPage,
      hasNextPage: true,
    });
    props.filters = {
      height,
    };
    const wrapper = mountWithQueryClient(Blocks, props);
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
    props.sort = sort;
    const wrapper = mountWithQueryClient(Blocks, props);

    wrapper.find('.sort-by.height').simulate('click');
    expect(props.changeSort).toHaveBeenCalledWith('height', expect.any(Function));
  });
});
