import { renderHook, act } from '@testing-library/react-hooks';
import flushPromises from '@tests/unit-test-utils/flushPromises';
import { queryWrapper as wrapper } from 'src/utils/test/queryWrapper';
import * as delegateAPI from '@pos/validator/api';
import { useDelegates } from './queries';
import useDelegateName from './useDelegateName';

jest.mock('../api', () => ({
  getDelegate: jest.fn(),
}));
jest.mock('./queries/useDelegates');

describe('useDelegateName', () => {
  it('Initial values must be empty', () => {
    useDelegates.mockReturnValue({
      loading: false,
    });
    const { result } = renderHook(() => useDelegateName(), { wrapper });
    const [name] = result.current;

    expect(name.value).toBe('');
  });

  it('should account for the initial values', () => {
    useDelegates.mockReturnValue({
      loading: false,
    });
    const { result } = renderHook(() => useDelegateName('some_name'), { wrapper });
    const [name] = result.current;

    expect(name.value).toBe('some_name');
  });

  it('should mark as error if the value is empty or too short', () => {
    useDelegates.mockReturnValue({
      loading: false,
    });
    const { result } = renderHook(() => useDelegateName('s'), { wrapper });
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
    useDelegates.mockReturnValue({
      loading: false,
      data: { data: [{}] },
    });
    const { result } = renderHook(() => useDelegateName('test_1'), { wrapper });
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
    delegateAPI.getDelegate.mockRejectedValue({ message: 'Data not found.' });
    useDelegates.mockReturnValue({
      loading: false,
      error: {},
    });
    const { result } = renderHook(() => useDelegateName('test_1'), { wrapper });
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
