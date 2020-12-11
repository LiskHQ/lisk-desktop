import * as block from './index';
import { subscribe, unsubscribe } from '../ws';

jest.mock('../ws');

describe('Block api module', () => {
  it('Should call ws subscribe with parameters', () => {
    const fn = () => {};
    const serviceUrl = 'http://sample-service-url.com';
    block.blockSubscribe({ serviceUrl }, fn, fn, fn);
    expect(subscribe).toHaveBeenCalledTimes(1);
    expect(subscribe).toHaveBeenCalledWith(serviceUrl, 'blocks/change', fn, fn, fn);
  });

  it('Should call ws unsubscribe with parameters', () => {
    block.blockUnsubscribe();
    expect(unsubscribe).toHaveBeenCalledTimes(1);
    expect(unsubscribe).toHaveBeenCalledWith('blocks/change');
  });
});
