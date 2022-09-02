import { setupServer } from 'msw/node';
import handlers from './handlers';

// Setup requests interception using the given handlers.
// eslint-disable-next-line import/prefer-default-export
export const server = setupServer(...handlers);
