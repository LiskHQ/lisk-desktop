import { rest } from 'msw';
import { API_VERSION, LIMIT } from 'src/const/config';
import { mockBlocks } from '@block/__fixtures__';

export const blocks = rest.get(`*/api/${API_VERSION}/blocks`, async (req, res, ctx) => {
  const limit = Number(req.url.searchParams.get('limit') || LIMIT);
  const offset = Number(req.url.searchParams.get('offset') || 0);
  const response = {
    data: mockBlocks.data.slice(offset, offset + limit),
    meta: {
      ...mockBlocks.meta,
      count: limit,
      offset,
    },
  };
  return res(ctx.delay(20), ctx.json(response));
});

export const blocksAssets = rest.get(`*/api/${API_VERSION}/blocks/assets`, async (req, res, ctx) =>
  res(ctx.status(404), ctx.json({ message: 'N/A' }))
);
