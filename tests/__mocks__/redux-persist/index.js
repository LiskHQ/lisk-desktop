const real = jest.requireActual('redux-persist');
module.exports = {
  ...real,
  persistReducer: jest.fn((config, reducers) => reducers),
  persistStore: jest.fn((store) => store),
};
