import { renderHook } from '@testing-library/react-hooks';
import { queryWrapper as wrapper } from 'src/utils/test/queryWrapper';
import { useInvokeQuery } from 'src/modules/common/hooks/queries/useInvokeQuery';
import { usePosExpectedSharedRewards, useExpectedValidatorRewards } from './useStakingRewards';

jest.useRealTimers();

beforeEach(() => jest.clearAllMocks());

jest.mock('@pos/reward/hooks/queries/useStakingRewards', () => ({
  ...jest.requireActual('@pos/reward/hooks/queries/useStakingRewards'),
  useExpectedValidatorRewards: jest.fn(),
}));
jest.mock('src/modules/common/hooks/queries/useInvokeQuery');

describe('usePosExpectedSharedRewards hook', () => {
  const validatorAddress = 'lsktzb4j7e3knk4mkxckdr3y69gtu2nwmsb3hjbkg';
  const stake = '100';
  const validatorReward = '0';
  const queryConfig = {
    options: {
      enabled: true,
    },
    config: {
      params: {
        validatorAddress,
        stake,
        validatorReward,
      },
    },
  };

  beforeEach(() => {
    useExpectedValidatorRewards.mockReturnValue({
      data: {
        data: {
          blockReward: '500000000',
          dailyReward: '59916758400',
          monthlyReward: '1797502752000',
          yearlyReward: '21869616816000',
        },
      },
    });
  });

  it('should return monthly reward', () => {
    const rewardResponse = {
      data: { reward: '123' },
    };
    useInvokeQuery.mockReturnValue({
      data: rewardResponse,
    });

    const { result } = renderHook(() => usePosExpectedSharedRewards(queryConfig, true), {
      wrapper,
    });

    expect(result.current.data).toEqual(rewardResponse);
  });

  it('should return yearly reward', () => {
    const rewardResponse = {
      data: { reward: '456' },
    };
    useInvokeQuery.mockReturnValue({
      data: rewardResponse,
    });

    const { result } = renderHook(() => usePosExpectedSharedRewards(queryConfig, false), {
      wrapper,
    });

    expect(result.current.data).toEqual(rewardResponse);
  });
});
