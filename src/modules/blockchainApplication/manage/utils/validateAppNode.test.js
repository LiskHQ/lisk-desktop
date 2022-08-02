import { validateAppNode } from './validateAppNode';
import { getApplicationConfig } from '../api';

jest.mock('../api');
const serviceUrl = 'https://api.coinbase.com';

describe('validateAppNode', () => {
  it('returns true if ping is successful', () => {
    getApplicationConfig.mockResolvedValue({ status: 'ok' });
    expect(validateAppNode(serviceUrl)).resolves.toBe(true);
  });

  it('throws an error if ping fails', () => {
    const appError = new Error(`Error getting details for application url: ${serviceUrl}`);
    getApplicationConfig.mockResolvedValue(null);
    expect(validateAppNode(serviceUrl)).rejects.toThrow(appError);
  });

  it('throws an error if ping fails due to incorrect node', () => {
    const appError = new Error(`Error getting details for application url: ${serviceUrl}`);
    getApplicationConfig.mockRejectedValue(appError);
    expect(validateAppNode(serviceUrl)).rejects.toThrow(appError);
  });
});
