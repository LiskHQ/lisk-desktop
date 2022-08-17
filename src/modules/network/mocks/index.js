import { rest } from 'msw';
import { API_VERSION } from 'src/const/config';
import { mockNetworkStatus } from '@network/__fixtures__';

// eslint-disable-next-line import/prefer-default-export
export const networkStatus = rest.get(
  `*/api/${API_VERSION}/network/status`, (req, res, ctx) => res(ctx.json(mockNetworkStatus)),
);
