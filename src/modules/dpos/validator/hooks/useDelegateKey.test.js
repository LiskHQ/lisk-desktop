import { renderHook, act } from '@testing-library/react-hooks';
import * as keys from '@tests/constants/keys';
import useDelegateKey from './useDelegateKey';

describe('useDelegateKey', () => {
  it('Initial values must be empty', () => {
    const { result } = renderHook(() => useDelegateKey('blsPublicKey', 'test message'));
    const [genKey] = result.current;

    expect(genKey.value).toBe('');
  });

  it('It should account for initial params', () => {
    const { result } = renderHook(() =>
      useDelegateKey('proofOfPossession', 'test message', keys.pop)
    );
    const [key] = result.current;

    expect(key.value).toBe(keys.pop);
  });

  it('Should set valid values with no errors', () => {
    const { result } = renderHook(() => useDelegateKey('generatorPublicKey', 'test message'));
    const [, setKey] = result.current;
    act(() => {
      setKey(keys.genKey);
    });

    const [genKey] = result.current;
    expect(genKey.value).toBe(keys.genKey);
  });

  it('should show generatorPublicKey error if the value is not a valid', () => {
    const { result } = renderHook(() => useDelegateKey('generatorPublicKey', 'test message'));
    const [, setKey] = result.current;
    act(() => {
      setKey('generatorPublicKey', 'wrong_value');
    });

    const [genKey] = result.current;
    expect(genKey.error).toBe(true);
  });

  it('should show blsPublicKey error if the value is not a valid', () => {
    const { result } = renderHook(() => useDelegateKey('blsPublicKey', 'test message'));
    const [, setKey] = result.current;
    act(() => {
      setKey('blsPublicKey', 'wrong_value');
    });

    const [blsKey] = result.current;
    expect(blsKey.error).toBe(true);
  });

  it('should show proofOfPossession error if the value is not a valid', () => {
    const { result } = renderHook(() => useDelegateKey('proofOfPossession', 'test message'));
    const [, setKey] = result.current;
    act(() => {
      setKey('proofOfPossession', 'wrong_value');
    });

    const [pop] = result.current;
    expect(pop.error).toBe(true);
  });
});
