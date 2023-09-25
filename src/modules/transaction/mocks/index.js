import { rest } from 'msw';
import { API_VERSION, LIMIT } from 'src/const/config';
import {
  mockEvents,
  mockFees,
  mockTransactionFees,
  mockTransactions,
  mockTransactionStatistics,
} from '@transaction/__fixtures__';

export const networkStatus = rest.post(`*/api/${API_VERSION}/transactions`, (_, res, ctx) =>
  res(ctx.delay(20), ctx.status(200))
);

export const transactions = rest.get(
  `*/api/${API_VERSION}/transactions`,
  // eslint-disable-next-line max-statements
  async (req, res, ctx) => {
    const limit = Number(req.url.searchParams.get('limit') || LIMIT);
    const offset = Number(req.url.searchParams.get('offset') || 0);
    const blockID = req.url.searchParams.get('blockID');
    const moduleCommandID = req.url.searchParams.get('moduleCommandID');
    let mockTransactionsData = mockTransactions.data;

    if (blockID) {
      mockTransactionsData = mockTransactionsData.filter((tx) => tx.block.id === blockID);
    }

    if (moduleCommandID) {
      mockTransactionsData = mockTransactionsData.filter(
        (tx) => tx.moduleCommandID === moduleCommandID
      );
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
  }
);

export const transactionStatistics = rest.get(
  `*/api/${API_VERSION}/transactions/statistics`,
  async (req, res, ctx) => {
    const limit = Number(req.url.searchParams.get('limit') || LIMIT);
    const offset = Number(req.url.searchParams.get('offset') || 0);
    const response = {
      data: {
        ...mockTransactionStatistics.data,
        timeline: Object.keys(mockTransactionStatistics.data.timeline).reduce(
          (acc, key) => ({
            ...acc,
            [key]: mockTransactionStatistics.data.timeline[key].slice(offset, offset + limit),
          }),
          {}
        ),
      },
      meta: {
        ...mockTransactionStatistics.meta,
        count: limit,
        offset,
      },
    };
    return res(ctx.delay(20), ctx.json(response));
  }
);

export const validator = rest.get(`*/api/${API_VERSION}/events`, async (req, res, ctx) => {
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
});

export const fees = rest.get(`*/api/${API_VERSION}/fees`, (_, res, ctx) => res(ctx.json(mockFees)));

export const transactionFees = rest.post(
  `*/api/${API_VERSION}/transactions/estimate-fees`,
  (_, res, ctx) => res(ctx.json(mockTransactionFees))
);
