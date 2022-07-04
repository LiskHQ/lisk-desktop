import * as reducers from './rootReducer';

jest.mock('src/redux/store', () => ({
  storage: {},
}));

describe('Reducer: Initiate reducers', () => {
  it('should initiate the reducers with any first action', () => {
    Object.keys(reducers).forEach((reducer) => {
      const state = reducers[reducer](undefined, { type: 'sample' });
      expect(state).not.toBe(undefined);
    });
  });
});
