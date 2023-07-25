import { setImmediate } from 'timers';

const flushPromises = () => new Promise(setImmediate);

export default flushPromises;
