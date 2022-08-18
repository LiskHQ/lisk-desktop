import { rest } from 'msw';
import { API_VERSION } from 'src/const/config';
import { mockLegacy } from '@legacy/__fixtures__';

// eslint-disable-next-line import/prefer-default-export
export const blocks = rest.get(
  `*/api/${API_VERSION}/legacy`,
  async (_, res, ctx) => {
    const response = mockLegacy;
    return res(ctx.json(response));
  },
);
