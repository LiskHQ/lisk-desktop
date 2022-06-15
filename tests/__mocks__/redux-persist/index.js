const real = jest.requireActual('redux-persist');
module.exports = {
  ...real,
  persistReducer: jest.fn().mockImplementation((config, reducers) => reducers),
  persistStore: jest.fn().mockImplementation((store) => store),
};
