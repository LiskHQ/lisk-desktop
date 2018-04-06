import i18n from './../i18n';
import menu from './../menu';
import win from './win';

const handler = {
  update: ({ electron, event, langCode, storage, checkForUpdates }) => {
    // change locale
    i18n.changeLanguage(langCode);
    // write selected lang on JSON file
    storage.set('config', { lang: langCode }, (error) => {
      if (error) throw error;
    });

    // rebuild menu
    const { Menu } = electron;
    Menu.setApplicationMenu(menu.build(electron, checkForUpdates));
    event.returnValue = 'Rebuilt electron menu.';
  },

  send: ({ storage }) => {
    storage.get('config', (error, data) => {
      if (!error) {
        win.send({ event: 'detectedLocale', value: data.lang || 'en' });
      }
    });
  },
};

export default handler;
