import { rest } from 'msw';
import { API_VERSION, LIMIT } from 'src/const/config';
import { mockTransactions, mockTransactionStatistics } from '@transaction/__fixtures__';

export const networkStatus = rest.post(
  `*/api/${API_VERSION}/transactions`, (req, res, ctx) => res(ctx.delay(20), ctx.status(200)),
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

// eslint-disable-next-line import/prefer-default-export
export const transactions = rest.get(
  `*/api/${API_VERSION}/transactions`,
  async (req, res, ctx) => {
    const limit = Number(req.url.searchParams.get('limit'));
    const offset = Number(req.url.searchParams.get('offset') || 0);
    const response = {
      data: mockTransactions.data.slice(offset, offset + limit),
      meta: {
        ...mockTransactions.meta,
        count: limit,
        offset,
      },
    };
    return res(ctx.json(response));
  },
);
