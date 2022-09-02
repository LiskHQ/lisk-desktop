import { rest } from 'msw';
import { API_VERSION } from 'src/const/config';
import { mockAuth } from '../__fixtures__';

// eslint-disable-next-line import/prefer-default-export
export const validator = rest.get(
  `*/api/${API_VERSION}/auth`,
  async (req, res, ctx) => res(ctx.delay(20), ctx.json(mockAuth)),
);
