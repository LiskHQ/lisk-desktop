import { LIMIT } from 'src/const/config';

function composeMockList({ req, res, ctx, mockData, delay = 20 }) {
  const limit = Number(req.url.searchParams.get('limit') || LIMIT);
  const offset = Number(req.url.searchParams.get('offset') || 0);
  const response = {
    data: mockData.data.slice(offset, offset + limit),
    meta: {
      ...mockData.meta,
      count: limit,
      offset,
    },
  };
  return res(ctx.delay(delay), ctx.json(response));
}

export default composeMockList;
