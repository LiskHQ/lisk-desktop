import i18n from 'i18next';
import menu from '../menu';
import win from './win';

const handler = {
  update: ({ electron, event, langCode, storage, checkForUpdates }) => {
    // change locale
    i18n.changeLanguage(langCode);
    // write selected lang on JSON file
    storage.set('config.lang', langCode);

    // rebuild menu
    const { Menu } = electron;
    Menu.setApplicationMenu(menu.build(electron, checkForUpdates));
    event.returnValue = 'Rebuilt electron menu.';
  },

  send: ({ storage }) => {
    storage.get('config.lang', 'en', (value) => {
      win.send({ event: 'detectedLocale', value });
    });
  },
};

export default handler;
