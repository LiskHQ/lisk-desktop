import Storage from 'electron-store';
import win from './win';
import { IPC_CONFIG_RETRIEVED } from '../../../src/const/ipcGlobal';

export const storage = new Storage();

export const setConfig = ({ value, key }) => {
  storage.set(`config.${key}`, value);
  win.send({ event: 'configStored', value: { [key]: value } });
};

export const readConfig = () => {
  // Ensure to return empty config if storage does not hold any value
  const value = storage.get('config') || {};
  win.send({ event: IPC_CONFIG_RETRIEVED, value });
};
