import { renderHook, act } from '@testing-library/react-hooks';
import { useSelector } from 'react-redux';
import accounts from '@tests/constants/wallets';
import setSecondPassphrase from './setSecondPassphrase';

jest.mock('src/redux/selectors');
jest.useRealTimers();

useSelector.mockReturnValue(accounts.secondPass);
describe('setSecondPassphrase', () => {
  it('Should return second passphrase with no error message', async () => {
    const { result, waitFor } = renderHook(() => setSecondPassphrase());
    const [state, setState] = result.current;
    expect(state.error).toBe(-1);
    act(() => {
      setState(accounts.secondPass.secondPass);
    });
    await waitFor(() => result.current[0].error);
    await waitFor(() => result.current[0].error);
    expect(result.current[0].error).toBe(0);
  });

  it('Should return second passphrase with relevant error message', async () => {
    const { result, waitFor } = renderHook(() => setSecondPassphrase());
    const [state, setState] = result.current;
    expect(state.error).toBe(-1);
    act(() => {
      setState(accounts.genesis.passphrase);
    });
    await waitFor(() => result.current[0].error);
    await waitFor(() => result.current[0].error);
    expect(result.current[0].error).toBe(1);
  });

  it('Should return second passphrase with an external error message, if provided', async () => {
    const { result, waitFor } = renderHook(() => setSecondPassphrase());
    const [state, setState] = result.current;
    expect(state.error).toBe(-1);
    act(() => {
      setState('wrong_pass', 'The pass is invalid');
    });
    await waitFor(() => result.current[0].error);
    await waitFor(() => result.current[0].error);
    expect(result.current[0].error).toBe(1);
  });

  it('Should return error when second passphrase is empty', async () => {
    const { result, waitFor } = renderHook(() => setSecondPassphrase());
    const [state, setState] = result.current;
    expect(state.error).toBe(-1);
    act(() => {
      setState('', 'The pass is invalid');
    });
    await waitFor(() => result.current[0].error);
    await waitFor(() => result.current[0].error);
    expect(result.current[0].error).toBe(-1);
  });
});
