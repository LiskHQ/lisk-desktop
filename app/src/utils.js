import EventStack from './modules/EventStack';
import Win from './modules/Win';

export const sendUrlToRouter = ({ url }) => { Win.send({ event: 'openUrl', value: url }); };

export const menuPopup = ({ props, inputMenu, selectionMenu }) => {
  const { selectionText, isEditable } = props;
  if (isEditable) {
    inputMenu.popup(Win.browser);
  } else if (selectionText && selectionText.trim() !== '') {
    selectionMenu.popup(Win.browser);
  }
};

export const sendEventsFromEventStack = () => {
  if (EventStack.length > 0) {
    EventStack.forEach(({ event, value }) => Win.browser.webContents.send(event, value));
  }

  return [];
};

export const sendLanguage = ({ storage }) => {
  storage.get('config', (error, data) => {
    if (!error) {
      Win.send({ event: 'detectedLocale', value: data.lang || 'en' });
    }
  });
};

