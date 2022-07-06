import { renderHook, act } from '@testing-library/react-hooks';
import useDelegateKey from './useDelegateKey';

describe('useDelegateKey', () => {
  const value1 = 'dcad7c69505d549803fb6a755e81cdcb0a33ea95b6476e2585149f8a42c9c882';
  const value2 = '830ce8c4a0b4f40b9b2bd2f16e835676b003ae28ec367432af9bfaa4d5201051786643620eff288077c1e7a8415c0285';
  const value3 = '722b19e4b302e3e13ef097b417b651feadc8e28754530119911561c27b9478cdcd6b7ada331037bbda778b0b325aab5a79f34b31ea780acd01bf67d38268c43ea0ea75a5e757a76165253e1e20680c4cfd884ed63f5663c7b940e67162d5f715';

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
      () => useDelegateKey(value1, value2, value3),
    );
    const [genKey, blsKey, pop] = result.current;

    expect(genKey.value).toBe(value1);
    expect(blsKey.value).toBe(value2);
    expect(pop.value).toBe(value3);
  });

  it('Should set valid values with no errors', () => {
    const { result } = renderHook(
      () => useDelegateKey(),
    );
    const [,,, setKey] = result.current;
    act(() => {
      setKey('generatorPublicKey', value1); // 64
      setKey('blsPublicKey', value2); // 96
      setKey('proofOfPossession', value3); // 192
    });

    const [genKey, blsKey, pop] = result.current;
    expect(genKey.value).toBe(value1);
    expect(blsKey.value).toBe(value2);
    expect(pop.value).toBe(value3);
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
      setKey('generatorPublicKey', value2); // 96
      setKey('blsPublicKey', value3); // 192
      setKey('proofOfPossession', value1); // 64
    });

    const [genKey, blsKey, pop] = result.current;
    expect(genKey.error).toBe(true);
    expect(blsKey.error).toBe(true);
    expect(pop.error).toBe(true);
  });
});
