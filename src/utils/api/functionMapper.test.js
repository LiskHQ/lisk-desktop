import { tokenMap } from '../../constants/tokens';
import getMappedFunction from './functionMapper';

describe('api/functionMapper', () => {
  it('maps existing functions correctly', () => {
    const result = getMappedFunction(tokenMap.BTC.key, 'account', 'getSummary');
    expect(result).toBeDefined();
  });

  it('throws error for non-existing functions', () => {
    expect(() => getMappedFunction(tokenMap.LSK.key, 'account', 'unMappableFunction')).toThrow();
  });

  it('throws error for invalid path', () => {
    expect(() => getMappedFunction(tokenMap.BTC.key, 'invalidPath')).toThrow();
  });
});
