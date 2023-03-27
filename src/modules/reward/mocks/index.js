import { rest } from 'msw';
import { API_VERSION } from 'src/const/config';
import { mockRewardConstants, mockRewardInflation, mockRewardDefault } from '../__fixtures__';

export const rewardConstants = rest.get(
  `*/api/${API_VERSION}/reward/constants`,
  async (req, res, ctx) => res(ctx.delay(20), ctx.json(mockRewardConstants))
);

export const rewardInflation = rest.get(
  `*/api/${API_VERSION}/reward/inflation`,
  async (req, res, ctx) => res(ctx.delay(20), ctx.json(mockRewardInflation))
);

export const rewardDefault = rest.get(
  `*/api/${API_VERSION}/reward/default`,
  async (req, res, ctx) => res(ctx.delay(20), ctx.json(mockRewardDefault))
);
