import { renderHook } from '@testing-library/react-hooks';
import useMessageField from './useMessageField';

const mockDispatch = jest.fn();
const mockState = {
  value: 'test-message',
};

describe('useMessageField hook', () => {
  beforeEach(() => {
    mockDispatch.mockClear();
  });

  const { result } = renderHook(() => useMessageField(mockState.value));

  it('should return expected value and setter function', async () => {
    const [message, onMessageInputChange] = result.current;
    expect(message.value).toBe(mockState.value);
    expect(onMessageInputChange).toBeTruthy();
  });
});
