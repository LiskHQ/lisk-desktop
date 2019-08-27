import TransportNodeHid from '@ledgerhq/hw-transport-node-hid';
import { hwManager } from './hwManager';

const test = () => {
  const hwM = hwManager();
  hwM.setTransport({ type: 'ledger', transport: TransportNodeHid });
  hwM.listener();
  hwM.getDevices();
};

console.log('exeecute');
test();
console.log('end');
window.test = test;
export default test;
