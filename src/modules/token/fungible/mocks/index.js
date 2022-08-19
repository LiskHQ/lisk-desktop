import { rest } from 'msw';
import { API_VERSION } from 'src/const/config';
import { mockTokensBalance } from '@token/fungible/__fixtures__';

// eslint-disable-next-line import/prefer-default-export
export const tokensBalance = rest.get(
  `*/api/${API_VERSION}/tokens`,
  async (req, res, ctx) => {
    const limit = Number(req.url.searchParams.get('limit'));
    const offset = Number(req.url.searchParams.get('offset') || 0);
    const response = {
      data: mockTokensBalance.data.slice(offset, offset + limit),
      meta: {
        ...mockTokensBalance.meta,
        count: limit,
        offset,
      },
    };
    return res(ctx.json(response));
  },
);
