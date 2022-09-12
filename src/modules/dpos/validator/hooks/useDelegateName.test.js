import { renderHook, act } from '@testing-library/react-hooks';
import flushPromises from '@tests/unit-test-utils/flushPromises';
import * as delegateAPI from '@dpos/validator/api';
import useDelegateName from './useDelegateName';

jest.mock('@dpos/validator/api', () => ({
  getDelegate: jest.fn(),
}));

describe('useDelegateName', () => {
  it('Initial values must be empty', () => {
    const { result } = renderHook(
      () => useDelegateName(),
    );
    const [name] = result.current;

    expect(name.value).toBe('');
  });

  it('should account for the initial values', () => {
    const { result } = renderHook(
      () => useDelegateName('some_name'),
    );
    const [name] = result.current;

    expect(name.value).toBe('some_name');
  });

  it('should mark as error if the value is empty or too short', () => {
    const { result } = renderHook(
      () => useDelegateName('s'),
    );
    let [name, setName] = result.current;
    expect(name.error).toBe(true);
    expect(name.message).toBe('Username is too short.');

    act(() => {
      setName({
        ...name,
        value: '',
      });
    });
    [name, setName] = result.current;
    expect(name.error).toBe(true);
    expect(name.message).toBe('Username can not be empty.');
  });

  it('should mark as error if the value is not unique', async () => {
    delegateAPI.getDelegate.mockResolvedValue({
      data: [{}],
      meta: {},
    });
    const { result } = renderHook(
      () => useDelegateName('test_1'),
    );
    jest.advanceTimersByTime(1001);
    await flushPromises();
    let [name, setName] = result.current;
    expect(name.error).toBe(true);
    expect(name.message).toBe('"{{username}}" is already taken.');

    act(() => {
      setName({
        ...name,
        value: 'test_2',
      });
    });
    jest.advanceTimersByTime(1001);
    await flushPromises();
    [name, setName] = result.current;
    expect(name.error).toBe(true);
    expect(name.message).toBe('"{{username}}" is already taken.');
  });

  it('should return no errors if the value is unique', async () => {
    delegateAPI.getDelegate.mockRejectedValue({ message: 'Data not found.' });
    const { result } = renderHook(
      () => useDelegateName('test_1'),
    );
    jest.advanceTimersByTime(1001);
    await flushPromises();
    let [name, setName] = result.current;
    expect(name.error).toBe(false);
    expect(name.message).toBe('');

    act(() => {
      setName({
        ...name,
        value: 'test_2',
      });
    });
    jest.advanceTimersByTime(1001);
    await flushPromises();
    [name, setName] = result.current;
    expect(name.error).toBe(false);
    expect(name.message).toBe('');
  });
});
