import { renderHook, act } from '@testing-library/react-hooks';
import { useSelector } from 'react-redux';
import accounts from '@tests/constants/wallets';
import setSecondPassphrase from './setSecondPassphrase';

jest.mock('src/redux/selectors');

// const mockSelector = jest.fn();
useSelector.mockReturnValue(accounts.secondPass);

describe('setSecondPassphrase', () => {
  it('Should return second passphrase with no error message', () => {
    const result = renderHook(() => setSecondPassphrase());
    const [state, setState] = result.result.current;
    expect(state.error).toBe(-1);
    act(() => {
      setState(accounts.secondPass.secondPass);
    });
    expect(result.result.current[0].error).toBe(0);
  });

  it('Should return second passphrase with relevant error message', () => {
    const result = renderHook(() => setSecondPassphrase());
    const [state, setState] = result.result.current;
    expect(state.error).toBe(-1);
    act(() => {
      setState(accounts.genesis.passphrase);
    });
    expect(result.result.current[0].error).toBe(1);
  });

  it('Should return second passphrase with an external error message, if provided', () => {
    const result = renderHook(() => setSecondPassphrase());
    const [state, setState] = result.result.current;
    expect(state.error).toBe(-1);
    act(() => {
      setState('wrong_pass', 'The pass is invalid');
    });
    expect(result.result.current[0].error).toBe(1);
  });
});
