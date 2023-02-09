import { rest } from 'msw';
import { API_VERSION } from 'src/const/config';
import { mockRewardsClaimable, mockRewardsLocked } from '@pos/reward/__fixtures__';

export const posRewardsLocked = rest.get(`*/api/${API_VERSION}/pos/rewards/locked`, async (req, res, ctx) => res(ctx.delay(20), ctx.json(mockRewardsLocked)));

export const posRewardsClaimable = rest.get(`*/api/${API_VERSION}/pos/rewards/claimable`, async (req, res, ctx) => res(ctx.delay(20), ctx.json(mockRewardsClaimable)));
