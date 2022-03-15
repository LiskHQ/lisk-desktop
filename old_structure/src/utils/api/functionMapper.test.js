import functionMapper from './functionMapper';

describe('functionMapper', () => {
  it('should merge methods', () => {
    const lsk = {
      fn1: jest.fn(),
      fn2: jest.fn(),
    };

    const btc = {
      fn2: jest.fn(),
      fn3: jest.fn(),
    };

    const merged = functionMapper(lsk, btc);
    merged.fn1({ id: 1 });
    expect(lsk.fn1).toHaveBeenCalledWith({ id: 1 });

    merged.fn2({ id: 1 }, 'LSK');
    expect(lsk.fn2).toHaveBeenCalledWith({ id: 1 });

    merged.fn2({ id: 1 }, 'BTC');
    expect(btc.fn2).toHaveBeenCalledWith({ id: 1 });

    merged.fn3({ id: 1 });
    expect(btc.fn3).toHaveBeenCalledWith({ id: 1 });

    expect(Object.keys(merged)).toHaveLength(3);
  });
});
