import { rest } from 'msw';
import { API_VERSION } from 'src/const/config';
import { mockLegacy } from '@legacy/__fixtures__';

export const legacy = rest.get(`*/api/${API_VERSION}/legacy`, async (_, res, ctx) => {
  const response = mockLegacy;
  return res(ctx.json(response));
});
