import { rest } from 'msw';
import { API_VERSION } from 'src/const/config';
import { mockTransactions } from '@transaction/__fixtures__';

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
