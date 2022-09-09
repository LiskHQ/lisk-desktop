import { renderHook } from '@testing-library/react-hooks';
import useMessageField from './useMessageField';

const mockSetter = jest.fn();
const mockState = {
  value: 'test-message',
};

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useState: (value) => [value, mockSetter],
}));

describe('useMessageField hook', () => {
  beforeEach(() => {
    mockSetter.mockClear();
  });

  const { result } = renderHook(() => useMessageField(mockState.value));

  it('should return expected value and setter function', async () => {
    const [message, onMessageInputChange] = result.current;
    expect(message.value).toBe(mockState.value);
    expect(onMessageInputChange).toBeTruthy();

    onMessageInputChange({ target: { ...mockState } });
    expect(mockSetter).toHaveBeenCalled();
  });
});
