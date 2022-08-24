import ConnectionContext from './connectionContext';

describe('connectionContext', () => {
  it('Should return the initial state of the context data', () => {
    const context = ConnectionContext.Provider.getInitialState();
    expect(context).toEqual({
      events: [],
      pairings: [],
      session: {
        request: false,
        data: false,
        loaded: false,
      },
    });
  });
});
