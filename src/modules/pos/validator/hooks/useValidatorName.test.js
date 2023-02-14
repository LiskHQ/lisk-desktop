import { renderHook, act } from '@testing-library/react-hooks';
import flushPromises from '@tests/unit-test-utils/flushPromises';
import { queryWrapper as wrapper } from 'src/utils/test/queryWrapper';
import * as validatorAPI from '@pos/validator/api';
import { useValidators } from './queries';
import useValidatorName from './useValidatorName';

jest.mock('../api', () => ({
  getValidator: jest.fn(),
}));
jest.mock('./queries/useValidators');

describe('useValidatorName', () => {
  it('Initial values must be empty', () => {
    useValidators.mockReturnValue({
      loading: false,
    });
    const { result } = renderHook(() => useValidatorName(), { wrapper });
    const [name] = result.current;

    expect(name.value).toBe('');
  });

  it('should account for the initial values', () => {
    useValidators.mockReturnValue({
      loading: false,
    });
    const { result } = renderHook(() => useValidatorName('some_name'), { wrapper });
    const [name] = result.current;

    expect(name.value).toBe('some_name');
  });

  it('should mark as error if the value is empty or too short', () => {
    useValidators.mockReturnValue({
      loading: false,
    });
    const { result } = renderHook(() => useValidatorName('s'), { wrapper });
    let [name, setName] = result.current;
    expect(name.error).toBe(true);
    expect(name.message).toBe('Username is too short.');

    act(() => {
      setName('');
    });
    [name, setName] = result.current;
    expect(name.error).toBe(true);
    expect(name.message).toBe('Username can not be empty.');
  });

  it('should mark as error if the value is not unique', async () => {
    useValidators.mockReturnValue({
      loading: false,
      data: { data: [{}] },
    });
    const { result } = renderHook(() => useValidatorName('test_1'), { wrapper });
    jest.advanceTimersByTime(1001);
    await flushPromises();
    let [name, setName] = result.current;
    expect(name.error).toBe(true);
    expect(name.message).toBe('"{{username}}" is already taken.');

    act(() => {
      setName('test_2');
    });
    jest.advanceTimersByTime(1001);
    await flushPromises();
    [name, setName] = result.current;
    expect(name.error).toBe(true);
    expect(name.message).toBe('"{{username}}" is already taken.');
  });

  it('should return no errors if the value is unique', async () => {
    validatorAPI.getValidator.mockRejectedValue({ message: 'Data not found.' });
    useValidators.mockReturnValue({
      loading: false,
      error: {},
    });
    const { result } = renderHook(() => useValidatorName('test_1'), { wrapper });
    jest.advanceTimersByTime(1001);
    await flushPromises();
    let [name, setName] = result.current;
    expect(name.error).toBe(false);
    expect(name.message).toBe('');

    act(() => {
      setName('test_2');
    });
    jest.advanceTimersByTime(1001);
    await flushPromises();
    [name, setName] = result.current;
    expect(name.error).toBe(false);
    expect(name.message).toBe('');
  });
});
