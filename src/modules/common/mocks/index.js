import { rest } from 'msw';
import { API_VERSION, LIMIT } from 'src/const/config';
import { mockNewsFeed } from '../__fixtures__';

// eslint-disable-next-line import/prefer-default-export
export const webSocket = rest.get(
  '*/socket.io/',
  (_, res, ctx) => res(
    ctx.status(200),
    ctx.set('Connection', 'keep-alive'),
    ctx.set('Content-Type', 'text/event-stream'),
    ctx.body('data: SUCCESS\n\n'),
  ),
);

export const blocks = rest.get(
  `*/api/${API_VERSION}/newsfeed`,
  async (req, res, ctx) => {
    const limit = Number(req.url.searchParams.get('limit') || LIMIT);
    const offset = Number(req.url.searchParams.get('offset') || 0);
    const response = {
      data: mockNewsFeed.data.slice(offset, offset + limit),
      meta: {
        ...mockNewsFeed.meta,
        count: limit,
        offset,
      },
    };
    return res(ctx.delay(20), ctx.json(response));
  },
);
