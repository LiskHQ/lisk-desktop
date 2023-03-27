import { rest } from 'msw';
import { API_VERSION, LIMIT } from 'src/const/config';
import { mockBlockchainAppMeta } from '@blockchainApplication/manage/__fixtures__';

export const blockchainApp = rest.get(
  `*/api/${API_VERSION}/blockchain/apps/meta`,
  async (req, res, ctx) => {
    const limit = Number(req.url.searchParams.get('limit') || LIMIT);
    const offset = Number(req.url.searchParams.get('offset') || 0);
    const data = mockBlockchainAppMeta.data.slice(offset, offset + limit);
    const response = {
      data,
      meta: {
        ...mockBlockchainAppMeta.meta,
        count: data.length,
        offset,
      },
    };
    return res(ctx.delay(20), ctx.json(response));
  }
);
