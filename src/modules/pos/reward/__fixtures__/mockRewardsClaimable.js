import { mockAppsTokens } from '@token/fungible/__fixtures__';

export const mockRewardsClaimable = {
  data: [
    {
      reward: '30',
      tokenID: '0000000100000000',
    },
    {
      reward: '10000',
      tokenID: '0000000200000000',
    },
    {
      reward: '20000',
      tokenID: '0000000300000000',
    },
  ],
  meta: {
    count: 3,
    offset: 0,
    total: 3,
  },
};

export const mockRewardsClaimableWithToken = {
  data: mockRewardsClaimable.data?.map((rewardsClaimable) => {
    const token = mockAppsTokens.data.find(
      (metaToken) => metaToken.tokenID === rewardsClaimable.tokenID
    );

    return {
      ...rewardsClaimable,
      ...token,
    };
  }),
  meta: mockRewardsClaimable.meta,
};
