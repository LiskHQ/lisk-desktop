import { renderHook, act } from '@testing-library/react-hooks';

import { useDebounce } from './useDebounce';

jest.useFakeTimers('legacy');

describe('useDebounce hook', () => {
  it('should be defined', () => {
    expect(useDebounce).toBeDefined();
  });

  it('returns correct debounced value after mounting', async () => {
    const { result } = renderHook(() => useDebounce('value1', 1000));

    act(() => {
      jest.runOnlyPendingTimers();
    });

    expect(result.current).toBe('value1');
  });

  it('returns correct debounced value on change', async () => {
    let initialValue = 'value1';
    const initialDelay = 1000;

    const { result, rerender } = renderHook(() => useDebounce(initialValue, initialDelay));

    act(() => {
      jest.runOnlyPendingTimers();
    });

    initialValue = 'value2';

    rerender();

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(result.current).toBe('value2');
  });
});
