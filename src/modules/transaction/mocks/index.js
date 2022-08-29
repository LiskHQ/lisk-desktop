import { rest } from 'msw';
import { API_VERSION, LIMIT } from 'src/const/config';
import {
  mockEvents, mockFees, mockTransactions, mockTransactionStatistics,
} from '@transaction/__fixtures__';

export const networkStatus = rest.post(
  `*/api/${API_VERSION}/transactions`, (_, res, ctx) => res(ctx.delay(20), ctx.status(200)),
);

export const transactions = rest.get(
  `*/api/${API_VERSION}/transactions`,
  async (req, res, ctx) => {
    const limit = Number(req.url.searchParams.get('limit') || LIMIT);
    const offset = Number(req.url.searchParams.get('offset') || 0);
    const blockID = req.url.searchParams.get('blockID');
    let mockTransactionsData = mockTransactions.data;
    if (blockID) {
      mockTransactionsData = mockTransactionsData.filter((tx) => tx.block.id === blockID)[0];
    }
    const response = {
      data: mockTransactionsData.slice(offset, offset + limit),
      meta: {
        ...mockTransactions.meta,
        count: limit,
        offset,
      },
    };
    return res(ctx.json(response));
  },
);

export const transactionStatistics = rest.get(
  `*/api/${API_VERSION}/transactions/statistics`,
  async (req, res, ctx) => {
    const limit = Number(req.url.searchParams.get('limit') || LIMIT);
    const offset = Number(req.url.searchParams.get('offset') || 0);
    const response = {
      data: {
        ...mockTransactionStatistics.data,
        timeline: mockTransactionStatistics.data.timeline.slice(offset, offset + limit),
      },
      meta: {
        ...mockTransactionStatistics.meta,
        count: limit,
        offset,
      },
    };
    return res(ctx.delay(20), ctx.json(response));
  },
);

export const validator = rest.get(
  `*/api/${API_VERSION}/events`,
  async (req, res, ctx) => {
    const limit = Number(req.url.searchParams.get('limit') || LIMIT);
    const offset = Number(req.url.searchParams.get('offset') || 0);
    const response = {
      data: mockEvents.data.slice(offset, offset + limit),
      meta: {
        ...mockEvents.meta,
        count: limit,
        offset,
      },
    };
    return res(ctx.delay(20), ctx.json(response));
  },
);

export const fees = rest.get(
  `*/api/${API_VERSION}/fees`, (_, res, ctx) => res(ctx.json(mockFees)),
);
