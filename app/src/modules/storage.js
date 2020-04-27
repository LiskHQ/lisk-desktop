import Storage from 'electron-store';
import win from './win';

export const storage = new Storage();

export const setConfig = ({
  value, key,
}) => {
  storage.set(`config.${key}`, value);
  win.send({ event: 'configStored', value: { [key]: value } });
};

export const readConfig = () => {
  const value = storage.get('config');
  win.send({ event: 'configRetrieved', value });
};
