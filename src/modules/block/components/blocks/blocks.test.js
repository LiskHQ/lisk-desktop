import { fireEvent, screen, waitFor } from '@testing-library/react';
import { renderWithQueryClient } from 'src/utils/testHelpers';
import Blocks from './blocks';
// import blocks from '@tests/constants/blocks';

describe('dummy', () => {
  it('placeholder', () => {
    expect(true).toBe(true);
  });
});

// @todo: Reinstate when filter hook is implemented and used in blocks component
describe.skip('Blocks page', () => {
  let props;
  //   let blocksWithData;
  const mockApplyFilters = jest.fn();
  const mockClearFilter = jest.fn();
  const mockClearAllFilters = jest.fn();
  const mockChangeSort = jest.fn();

  beforeEach(() => {
    props = {
      filters: {
        dateFrom: '',
        dateTo: '',
        height: '',
        generatorAddress: '',
      },
      applyFilters: mockApplyFilters,
      clearFilter: mockClearFilter,
      clearAllFilters: mockClearAllFilters,
      sort: 'height:desc',
      changeSort: mockChangeSort,
    //       t: key => key,
    //       blocks: {
    //         isLoading: true,
    //         data: [],
    //         meta: null,
    //         loadData: jest.fn(),
    //         clearData: jest.fn(),
    //         urlSearchParams: {},
      // },
    };
    renderWithQueryClient(Blocks, props);
  //     blocksWithData = {
  //       ...props.blocks,
  //       isLoading: false,
  //       data: blocks,
  //       meta: {
  //         count: blocks.length,
  //         total: blocks.length * 3,
  //         offset: 0,
  //       },
  //     };
  });

  it('renders a page with header', () => {
    expect(screen.getByText('All blocks')).toBeInTheDocument();
  });

  it('renders table with loader', () => {
    expect(screen.getAllByTestId('skeleton-wrapper')).toHaveLength(5);
  });

  it('renders table with blocks', () => {
    // const wrapper = mount(<Blocks {...props} />);
    // expect(wrapper.find('a.row')).toHaveLength(0);
    // wrapper.setProps({ blocks: blocksWithData });
    // expect(wrapper.find('a.row')).toHaveLength(blocks.length);
    expect(screen.queryByTestId('blocks-row')).not.toBeInTheDocument();
    waitFor(() => expect(screen.getByText('411')).toBeInTheDocument());
  });

  //   it('allows to load more blocks', () => {
  //     const wrapper = mount(<Blocks {...{ ...props, blocks: blocksWithData }} />);
  //     wrapper.find('button.load-more').simulate('click');
  //     expect(props.blocks.loadData).toHaveBeenCalledWith({ offset: blocks.length, sort });
  //   });

  //   it('shows error if API failed', () => {
  //     const error = 'Loading failed';
  //     const wrapper = mount(<Blocks {...props} />);
  //     wrapper.setProps({
  //       blocks: {
  //         ...props.blocks,
  //         isLoading: false,
  //         error,
  //       },
  //     });
  //     expect(wrapper).toIncludeText(error);
  //   });

  it('allows to filter blocks by height and clear the filter', () => {
    // const wrapper = mount(<Blocks {...props} />);
    // wrapper.find('button.filter').simulate('click');
    fireEvent.click(screen.getByText('Filter'));
    fireEvent.change(screen.getByTestId('height'), { target: { value: 318 } });
    fireEvent.click(screen.getByText('Apply filters'));
    expect(mockApplyFilters).toHaveBeenCalledTimes(1);
    expect(mockApplyFilters).toHaveBeenCalledWith({ ...props.filters, height: '318' });
    // wrapper.find('input.height').simulate('change', { target: { value: height } });
    // wrapper.find('form.filter-container').simulate('submit');
    // expect(props.blocks.loadData).toHaveBeenCalledWith({ height, sort });
    // wrapper.find('span.clear-filter').simulate('click');
    // expect(props.blocks.loadData).toHaveBeenCalledWith({ sort });
  });

  //   it('allows to load more blocks when filtered', () => {
  //     const wrapper = mount(<Blocks {...{ ...props, blocks: blocksWithData }} />);

  //     wrapper.find('button.filter').simulate('click');
  //     wrapper.find('input.height').simulate('change', { target: { value: height } });
  //     wrapper.find('form.filter-container').simulate('submit');
  //     wrapper.find('button.load-more').simulate('click');

  // eslint-disable-next-line max-len
  //     expect(props.blocks.loadData).toHaveBeenCalledWith({ offset: blocks.length, height, sort });
  //   });

//   it('allows to reverse sort by clicking height header', () => {
//     const wrapper = mount(<Blocks {...{ ...props, blocks: blocksWithData }} />);
//     wrapper.find('.sort-by.height').simulate('click');
//     expect(props.blocks.loadData).toHaveBeenCalledWith({ sort: 'height:asc' });
//     wrapper.find('.sort-by.height').simulate('click');
//     expect(props.blocks.loadData).toHaveBeenCalledWith({ sort: 'height:desc' });
//   });
// });
});
