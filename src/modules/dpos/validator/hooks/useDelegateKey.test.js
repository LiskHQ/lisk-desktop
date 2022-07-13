import { renderHook, act } from '@testing-library/react-hooks';
import * as keys from '@tests/constants/keys';
import useDelegateKey from './useDelegateKey';

describe('useDelegateKey', () => {
  it('Initial values must be empty', () => {
    const { result } = renderHook(
      () => useDelegateKey(),
    );
    const [genKey, blsKey, pop] = result.current;

    expect(genKey.value).toBe('');
    expect(blsKey.value).toBe('');
    expect(pop.value).toBe('');
  });

  it('It should account for initial params', () => {
    const { result } = renderHook(
      () => useDelegateKey(keys.genKey, keys.blsKey, keys.pop),
    );
    const [genKey, blsKey, pop] = result.current;

    expect(genKey.value).toBe(keys.genKey);
    expect(blsKey.value).toBe(keys.blsKey);
    expect(pop.value).toBe(keys.pop);
  });

  it('Should set valid values with no errors', () => {
    const { result } = renderHook(
      () => useDelegateKey(),
    );
    const [,,, setKey] = result.current;
    act(() => {
      setKey('generatorPublicKey', keys.genKey); // 64
      setKey('blsPublicKey', keys.blsKey); // 96
      setKey('proofOfPossession', keys.pop); // 192
    });

    const [genKey, blsKey, pop] = result.current;
    expect(genKey.value).toBe(keys.genKey);
    expect(blsKey.value).toBe(keys.blsKey);
    expect(pop.value).toBe(keys.pop);
  });

  it('should show error if the value is not a valid hex string', () => {
    const { result } = renderHook(
      () => useDelegateKey(),
    );
    const [,,, setKey] = result.current;
    act(() => {
      setKey('generatorPublicKey', 'qqq');
      setKey('blsPublicKey', 'qqq');
      setKey('proofOfPossession', 'qqq');
    });

    const [genKey, blsKey, pop] = result.current;
    expect(genKey.error).toBe(true);
    expect(blsKey.error).toBe(true);
    expect(pop.error).toBe(true);
  });

  it('should show error if the hex value has a different length than expected', () => {
    const { result } = renderHook(
      () => useDelegateKey(),
    );
    const [,,, setKey] = result.current;
    act(() => {
      setKey('generatorPublicKey', keys.blsKey); // 96
      setKey('blsPublicKey', keys.pop); // 192
      setKey('proofOfPossession', keys.genKey); // 64
    });

    const [genKey, blsKey, pop] = result.current;
    expect(genKey.error).toBe(true);
    expect(blsKey.error).toBe(true);
    expect(pop.error).toBe(true);
  });
});
