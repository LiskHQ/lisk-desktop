import { rest } from 'msw';
import { API_VERSION } from 'src/const/config';

// eslint-disable-next-line import/prefer-default-export
export const networkStatus = rest.post(
  `*/api/${API_VERSION}/transactions`, (req, res, ctx) => res(ctx.status(200)),
);
