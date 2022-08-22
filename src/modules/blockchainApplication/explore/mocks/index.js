import { rest } from 'msw';
import { API_VERSION, LIMIT } from 'src/const/config';
import { mockBlockchainApp } from '@blockchainApplication/explore/__fixtures__/mockBlockchainApp';

// eslint-disable-next-line import/prefer-default-export
export const blockchainApp = rest.get(
  `*/api/${API_VERSION}/blockchain/apps`,
  async (req, res, ctx) => {
    const limit = Number(req.url.searchParams.get('limit') || LIMIT);
    const offset = Number(req.url.searchParams.get('offset') || 0);
    const data = mockBlockchainApp.data.slice(offset, offset + limit);
    const response = {
      data,
      meta: {
        ...mockBlockchainApp.meta,
        count: data.length,
        offset,
      },
    };
    return res(ctx.delay(20), ctx.json(response));
  },
);
