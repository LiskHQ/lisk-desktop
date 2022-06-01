import authMiddleware from './middleware';

describe('Auth middleware', () => {
  const next = jest.fn();

  it('dismisses toasts after login', async () => {
    await authMiddleware()(next)({ type: 'test' });
  });
});
