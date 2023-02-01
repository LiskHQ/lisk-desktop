import { rest } from 'msw';
import { API_VERSION, LIMIT } from 'src/const/config';
import {
  getMockValidators,
  mockSentStakes,
  mockReceivedStakes,
  mockUnlocks,
  mockGenerators,
  mockGenerator,
} from '@pos/validator/__fixtures__';
import composeMockList from 'src/modules/common/utils/composeMockList';
import { mockPosConstants } from '../__fixtures__/mockPosConstants';

export const validators = rest.get(`*/api/${API_VERSION}/pos/validators`, async (req, res, ctx) => {
  const address = req.url.searchParams.get('address');

  return composeMockList({
    req,
    res,
    ctx,
    mockData: getMockValidators(address),
  });
});

export const sentStakes = rest.get(`*/api/${API_VERSION}/pos/stakes`, async (req, res, ctx) => {
  const response = {
    data: {
      ...mockSentStakes.data,
      stakes: mockSentStakes.data.stakes,
    },
    meta: {
      ...mockSentStakes.meta,
    },
  };
  return res(ctx.delay(20), ctx.json(response));
});

export const receivedStakes = rest.get(
  `*/api/${API_VERSION}/pos/stakers`,
  async (req, res, ctx) => {
    const limit = Number(req.url.searchParams.get('limit') || LIMIT);
    const offset = Number(req.url.searchParams.get('offset') || 0);
    const response = {
      data: {
        ...mockReceivedStakes.data,
        stakers: mockReceivedStakes.data.stakers.slice(offset, offset + limit),
      },
      meta: {
        ...mockReceivedStakes.meta,
        count: limit,
        offset,
      },
    };
    return res(ctx.delay(20), ctx.json(response));
  }
);

export const unlocks = rest.get(`*/api/${API_VERSION}/pos/unlocks`, async (req, res, ctx) => {
  const limit = Number(req.url.searchParams.get('limit') || LIMIT);
  const offset = Number(req.url.searchParams.get('offset') || 0);
  const response = {
    data: {
      ...mockUnlocks.data,
      pendingUnlocks: mockUnlocks.data.pendingUnlocks.slice(offset, offset + limit),
    },
    meta: {
      ...mockUnlocks.meta,
      count: limit,
      offset,
    },
  };
  return res(ctx.delay(20), ctx.json(response));
});

export const validator = rest.get(`*/api/${API_VERSION}/validator`, async (req, res, ctx) =>
  res(ctx.delay(20), ctx.json(mockGenerators))
);

export const generators = rest.get(`*/api/${API_VERSION}/generators`, async (req, res, ctx) => {
  const limit = Number(req.url.searchParams.get('limit') || LIMIT);
  const offset = Number(req.url.searchParams.get('offset') || 0);
  const response = {
    data: mockGenerator.data.slice(offset, offset + limit),
    meta: {
      ...mockGenerator.meta,
      count: limit,
      offset,
    },
  };
  return res(ctx.delay(20), ctx.json(response));
});

export const posConstants = rest.get(`*/api/${API_VERSION}/pos/constants`, async (_, res, ctx) =>
  res(ctx.delay(20), ctx.json(mockPosConstants))
);
