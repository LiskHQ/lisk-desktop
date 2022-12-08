import { renderHook, act } from '@testing-library/react-hooks';
import * as keys from '@tests/constants/keys';
import useValidatorKey from './useValidatorKey';

describe('useValidatorKey', () => {
  it('Initial values must be empty', () => {
    const { result } = renderHook(() => useValidatorKey('blsKey', 'test message'));
    const [genKey] = result.current;

    expect(genKey.value).toBe('');
  });

  it('It should account for initial params', () => {
    const { result } = renderHook(() =>
      useValidatorKey('proofOfPossession', 'test message', keys.pop)
    );
    const [key] = result.current;

    expect(key.value).toBe(keys.pop);
  });

  it('Should set valid values with no errors', () => {
    const { result } = renderHook(() => useValidatorKey('generatorKey', 'test message'));
    const [, setKey] = result.current;
    act(() => {
      setKey(keys.genKey);
    });

    const [genKey] = result.current;
    expect(genKey.value).toBe(keys.genKey);
  });

  it('should show generatorKey error if the value is not a valid', () => {
    const { result } = renderHook(() => useValidatorKey('generatorKey', 'test message'));
    const [, setKey] = result.current;
    act(() => {
      setKey('generatorKey', 'wrong_value');
    });

    const [genKey] = result.current;
    expect(genKey.error).toBe(true);
  });

  it('should show blsKey error if the value is not a valid', () => {
    const { result } = renderHook(() => useValidatorKey('blsKey', 'test message'));
    const [, setKey] = result.current;
    act(() => {
      setKey('blsKey', 'wrong_value');
    });

    const [blsKey] = result.current;
    expect(blsKey.error).toBe(true);
  });

  it('should show proofOfPossession error if the value is not a valid', () => {
    const { result } = renderHook(() => useValidatorKey('proofOfPossession', 'test message'));
    const [, setKey] = result.current;
    act(() => {
      setKey('proofOfPossession', 'wrong_value');
    });

    const [pop] = result.current;
    expect(pop.error).toBe(true);
  });
});
