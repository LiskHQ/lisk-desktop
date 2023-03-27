import { mountWithQueryClient } from 'src/utils/testHelpers';
import { mockBlocks } from '@block/__fixtures__';
import { useBlocks } from '../../hooks/queries/useBlocks';
import BlocksOverview from './blocksOverview';

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(() => ({
    t: (str, values = {}) => {
      if (!values) return str;
      return Object.keys(values).reduce(
        (acc, curr) => acc.replace(`{{${curr}}}`, values[curr]),
        str
      );
    },
  })),
}));
jest.mock('../../hooks/queries/useBlocks', () => ({
  useBlocks: jest.fn(() => ({
    data: mockBlocks,
  })),
}));

describe('Blocks Overview', () => {
  it('calls loadData when changing tab', async () => {
    const wrapper = mountWithQueryClient(BlocksOverview);
    expect(wrapper.find('.box-tabs .tab').at(0)).toIncludeText('Last 10 blocks');
    expect(wrapper.find('.box-tabs .tab').at(1)).toIncludeText('Last 50 blocks');
    expect(wrapper.find('.box-tabs .tab').at(2)).toIncludeText('Last 100 blocks');
    wrapper.find('.box-tabs ul li').at(1).simulate('click');
    expect(useBlocks).toBeCalledWith({ config: { params: { limit: 50 } } });
    wrapper.find('.box-tabs ul li').at(2).simulate('click');
    expect(useBlocks).toBeCalledWith({ config: { params: { limit: 100 } } });
    wrapper.find('.box-tabs ul li').at(0).simulate('click');
    expect(useBlocks).toBeCalledWith({ config: { params: { limit: 10 } } });
  });
});
