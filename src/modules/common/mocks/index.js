import { rest } from 'msw';
import { API_VERSION, LIMIT } from 'src/const/config';
import {
  mockCustomInfiniteQuery,
  mockNewsFeed,
  mockPrices,
  mockCcm,
  mockCommandParametersSchemas,
} from '../__fixtures__';

export const webSocketRPC = rest.get(
  '*/rpc-v3',
  (_, res, ctx) => res(
    ctx.status(200),
    ctx.set('Connection', 'keep-alive'),
    ctx.set('Content-Type', 'text/event-stream'),
    ctx.body('data: SUCCESS\n\n'),
  ),
);
export const webSocket = rest.get(
  '*/blockchain',
  (_, res, ctx) => res(
    ctx.status(200),
    ctx.set('Connection', 'keep-alive'),
    ctx.set('Content-Type', 'text/event-stream'),
    ctx.body('data: SUCCESS\n\n'),
  ),
);

export const newsFeed = rest.get(
  `*/api/${API_VERSION}/newsfeed`,
  async (req, res, ctx) => {
    const limit = Number(req.url.searchParams.get('limit') || LIMIT);
    const offset = Number(req.url.searchParams.get('offset') || 0);
    const response = {
      data: mockNewsFeed.data.slice(offset, offset + limit),
      meta: {
        ...mockNewsFeed.meta,
        count: limit,
        offset,
      },
    };
    return res(ctx.delay(20), ctx.json(response));
  },
);

export const marketPrices = rest.get(
  `*/api/${API_VERSION}/market/prices`,
  async (_, res, ctx) => {
    const response = mockPrices;
    return res(ctx.json(response));
  },
);

export const customInfiniteQuery = rest.get(
  '*/mock/custom-infinite-query',
  async (req, res, ctx) => {
    const limit = Number(req.url.searchParams.get('limit') || LIMIT);
    const offset = Number(req.url.searchParams.get('offset') || 0);
    const response = {
      data: mockCustomInfiniteQuery.data.slice(offset, offset + limit),
      meta: {
        ...mockCustomInfiniteQuery.meta,
        count: limit,
        offset,
      },
    };
    return res(ctx.delay(20), ctx.json(response));
  },
);

export const ccm = rest.get(
  `*/api/${API_VERSION}/ccm`,
  async (req, res, ctx) => {
    const limit = Number(req.url.searchParams.get('limit') || LIMIT);
    const offset = Number(req.url.searchParams.get('offset') || 0);
    const response = {
      data: mockCcm.data.slice(offset, offset + limit),
      meta: {
        ...mockCcm.meta,
        count: limit,
        offset,
      },
    };
    return res(ctx.delay(20), ctx.json(response));
  },
);

export const commandParametersSchemas = rest.get(
  `*/api/${API_VERSION}/schemas`,
  async (_, res, ctx) => {
    const response = mockCommandParametersSchemas;
    return res(ctx.json(response));
  },
);
