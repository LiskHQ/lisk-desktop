import { rest } from 'msw';
import { API_VERSION } from 'src/const/config';
import { mockDelegates } from '@dpos/validator/__fixtures__';
import composeMockList from 'src/modules/common/utils/composeMockList';

// eslint-disable-next-line import/prefer-default-export
export const delegates = rest.get(
  `*/api/${API_VERSION}/dpos/delegates`,
  async (req, res, ctx) =>
    composeMockList({
      req, res, ctx, mockData: mockDelegates,
    }),
);
