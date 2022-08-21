import { rest } from 'msw';
import { API_VERSION, LIMIT } from 'src/const/config';
import { mockDelegates, mockSentVotes } from '@dpos/validator/__fixtures__';
import composeMockList from 'src/modules/common/utils/composeMockList';

export const delegates = rest.get(
  `*/api/${API_VERSION}/dpos/delegates`,
  async (req, res, ctx) =>
    composeMockList({
      req, res, ctx, mockData: mockDelegates,
    }),
);

export const sentVotes = rest.get(
  `*/api/${API_VERSION}/dpos/votes/sent`,
  async (req, res, ctx) => {
    const limit = Number(req.url.searchParams.get('limit') || LIMIT);
    const offset = Number(req.url.searchParams.get('offset') || 0);
    const response = {
      data: {
        ...mockSentVotes.data,
        votes: mockSentVotes.data.votes.slice(offset, offset + limit),
      },
      meta: {
        ...mockSentVotes.meta,
        count: limit,
        offset,
      },
    };
    return res(ctx.delay(20), ctx.json(response));
  },
);
