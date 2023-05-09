import { rest } from 'msw';
import { API_VERSION } from 'src/const/config';
import {
  mockTokensBalance,
  mockTokensSupported,
  mockTokensTopLskBalance,
  mockAppsTokens,
  mockTokensAccountExists,
} from '@token/fungible/__fixtures__';

export const tokensBalance = rest.get(
  `*/api/${API_VERSION}/token/balances`,
  async (req, res, ctx) => {
    const limit = Number(req.url.searchParams.get('limit'));
    const offset = Number(req.url.searchParams.get('offset') || 0);
    const response = {
      data: mockTokensBalance.data.slice(offset, offset + limit),
      meta: {
        ...mockTokensBalance.meta,
        count: limit,
        offset,
      },
    };
    return res(ctx.json(response));
  }
);

export const tokensTopLskBalance = rest.get(
  `*/api/${API_VERSION}/tokens/lsk/top`,
  async (req, res, ctx) => {
    const limit = Number(req.url.searchParams.get('limit'));
    const offset = Number(req.url.searchParams.get('offset') || 0);
    const response = {
      data: mockTokensTopLskBalance.data.slice(offset, offset + limit),
      meta: {
        ...mockTokensTopLskBalance.meta,
        count: limit,
        offset,
      },
    };
    return res(ctx.json(response));
  }
);

export const tokensSupported = rest.get(
  `*/api/${API_VERSION}/token/summary`,
  async (req, res, ctx) => {
    const limit = Number(req.url.searchParams.get('limit'));
    const offset = Number(req.url.searchParams.get('offset') || 0);
    const response = {
      data: mockTokensSupported.data,
      meta: {
        ...mockTokensSupported.meta,
        count: limit,
        offset,
      },
    };
    return res(ctx.json(response));
  }
);

export const appsTokens = rest.get(
  `*/api/${API_VERSION}/blockchain/apps/meta/tokens`,
  async (req, res, ctx) => {
    const limit = Number(req.url.searchParams.get('limit'));
    const offset = Number(req.url.searchParams.get('offset') || 0);
    const response = {
      data: mockAppsTokens.data.slice(offset, offset + limit),
      meta: {
        ...mockTokensSupported.meta,
        count: limit,
        offset,
      },
    };
    return res(ctx.json(response));
  }
);

export const tokenAccountExists = rest.get(
  `*/api/${API_VERSION}/token/account/exists`,
  async (_, res, ctx) => {
    const response = mockTokensAccountExists;
    return res(ctx.json(response));
  }
);
