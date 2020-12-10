import * as block from './index';
import { subscribe, unsubscribe } from '../ws';

jest.mock('../ws');

describe('Block api module', () => {
  it('Should call ws subscribe with parameters', () => {
    const serviceUrl = 'http://sample-service-url.com';
    block.blockSubscribe({ serviceUrl });
    expect(subscribe).toHaveBeenCalledTimes(1);
    expect(subscribe.mock.calls[0][0]).toContain(serviceUrl);
    expect(subscribe.mock.calls[0][1]).toContain('blocks/change');
  });

  it('Should call ws unsubscribe with parameters', () => {
    block.blockUnsubscribe();
    expect(unsubscribe).toHaveBeenCalledTimes(1);
    expect(unsubscribe.mock.calls[0][0]).toContain('blocks/change');
  });
});
