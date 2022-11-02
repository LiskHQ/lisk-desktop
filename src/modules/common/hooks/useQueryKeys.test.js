import { renderHook } from '@testing-library/react-hooks';
import * as useCurrentApplication from 'src/modules/blockchainApplication/manage/hooks/useCurrentApplication';
import { queryWrapper } from 'src/utils/test/queryWrapper';

import { useQueryKeys } from './useQueryKeys';

jest.useRealTimers();

jest
  .spyOn(useCurrentApplication, 'useCurrentApplication')
  .mockImplementation(() => [
    {
      chainID: 'chainIdMock',
    },
  ]);

describe('useQueryKeys hook', () => {

  it('fetch data correctly', async () => {
    const { result } = renderHook(() => useQueryKeys(['DUMMY_KEY']), {
      wrapper: queryWrapper,
    });

    expect(result.current).toEqual(['DUMMY_KEY', 'chainIdMock', 'rest'])

  });
});
