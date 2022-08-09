import { rest } from 'msw';
import { API_VERSION } from 'src/const/config';
import { mockBlocks } from '@block/__fixtures__';

export const blocks = rest.get(
  `*/api/${API_VERSION}/blocks/`,
  async (req, res, ctx) => res(ctx.json(mockBlocks)),
);
export const blocksAssets = rest.get(
  `*/api/${API_VERSION}/blocks/assets`,
  async (req, res, ctx) => res(ctx.status(404), ctx.json({ message: 'N/A' })),
);
