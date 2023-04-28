import { rest } from 'msw';
import { API_VERSION, LIMIT } from 'src/const/config';
import { mockPeers, mockNetworkStatus, mockNetworkStatistics } from '@network/__fixtures__';

export const networkStatus = rest.get(`*/api/${API_VERSION}/network/status`, (_, res, ctx) =>
  res(ctx.json(mockNetworkStatus))
);
export const networkStatistics = rest.get(
  `*/api/${API_VERSION}/network/statistics`,
  (_, res, ctx) => res(ctx.json(mockNetworkStatistics))
);

export const peers = rest.get(`*/api/${API_VERSION}/network/peers`, async (req, res, ctx) => {
  const limit = Number(req.url.searchParams.get('limit') || LIMIT);
  const offset = Number(req.url.searchParams.get('offset') || 0);
  const response = {
    data: mockPeers.data.slice(offset, offset + limit),
    meta: {
      ...mockPeers.meta,
      count: limit,
      offset,
    },
  };
  return res(ctx.delay(20), ctx.json(response));
});
