import i18n from './../i18n';
import buildMenu from './../menu';
import Win from './Win';

const rebuildMenu = ({ electron, event }) => {
  const { Menu, app } = electron;
  Menu.setApplicationMenu(buildMenu(app));
  event.returnValue = 'Rebuilt electron menu.';
};

const changeLocale = ({ langCode, storage }) => {
  i18n.changeLanguage(langCode);
  // write selected lang on JSON file
  storage.set('config', { lang: langCode }, (error) => {
    if (error) throw error;
  });
};

export default {
  update: ({ electron, event, langCode, storage }) => {
    changeLocale({ langCode, storage });
    rebuildMenu({ electron, event });
  },

  send: ({ storage }) => {
    storage.get('config', (error, data) => {
      if (!error) {
        Win.send({ event: 'detectedLocale', value: data.lang || 'en' });
      }
    });
  },
};
