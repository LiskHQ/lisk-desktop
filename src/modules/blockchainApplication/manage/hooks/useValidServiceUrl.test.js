import * as client from 'src/utils/api/client';
import { resolveApiValidity } from './useValidServiceUrl';

describe('useValidServiceurl', () => {
  it('returns valid service url', async () => {
    jest.spyOn(client, 'Client').mockReturnValue({
      rest: jest.fn().mockResolvedValue(),
    });
    const serviceUrls = [{ http: 'http://localhost:9901' }, { http: 'http://localhost-2:9901' }];
    const validServiceUrl = await resolveApiValidity(serviceUrls);

    expect(validServiceUrl).toBe(serviceUrls[0].http);
  });

  it('should not return a url if serviceUrls are invalid', async () => {
    jest.spyOn(client, 'Client').mockReturnValue({
      rest: jest.fn().mockRejectedValue(),
    });

    const serviceUrls = [{ http: 'http://localhost:9901' }, { http: 'http://localhost-2:9901' }];
    const validServiceUrl = await resolveApiValidity(serviceUrls);

    expect(validServiceUrl).toBeFalsy();
  });

  it('should return the second url if the first is invalid', async () => {
    const serviceUrls = [{ http: 'http://localhost:9901' }, { http: 'http://localhost-2:9901' }];

    jest.spyOn(client, 'Client').mockImplementation(({ http }) => ({
      rest:
        http === `${serviceUrls[0].http}/api/v3/index/status`
          ? jest.fn().mockRejectedValue()
          : jest.fn().mockReturnValue(),
    }));
    const validServiceUrl = await resolveApiValidity(serviceUrls);

    expect(validServiceUrl).toBe(serviceUrls[1].http);
  });
});
