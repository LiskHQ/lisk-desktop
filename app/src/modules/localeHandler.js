import i18n from './../i18n';
import buildMenu from './../menu';
import win from './win';

const handler = {
  rebuildMenu: ({ electron, event }) => {
    const { Menu } = electron;
    Menu.setApplicationMenu(buildMenu({ electron }));
    event.returnValue = 'Rebuilt electron menu.';
  },

  changeLocale: ({ langCode, storage }) => {
    i18n.changeLanguage(langCode);
    // write selected lang on JSON file
    storage.set('config', { lang: langCode }, (error) => {
      if (error) throw error;
    });
  },

  update: ({ electron, event, langCode, storage }) => {
    handler.changeLocale({ langCode, storage });
    handler.rebuildMenu({ electron, event });
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
