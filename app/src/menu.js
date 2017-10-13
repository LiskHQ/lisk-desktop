const electron = require('electron'); // eslint-disable-line import/no-extraneous-dependencies

const { Menu } = electron;

const buildTemplate = t =>
  [
    {
      label: t('Edit'),
      submenu: [
        {
          role: 'undo',
          label: t('Undo'),
        },
        {
          role: 'redo',
          label: t('Redo'),
        },
        {
          type: t('separator'),
        },
        {
          role: 'cut',
          label: t('Cut'),
        },
        {
          role: 'copy',
          label: t('Copy'),
        },
        {
          role: 'paste',
          label: t('Paste'),
        },
        {
          role: 'selectall',
          label: t('Select all'),
        },
      ],
    },
    {
      label: t('View'),
      submenu: [
        {
          role: 'reload',
          label: t('Reload'),
        },
        {
          role: 'togglefullscreen',
          label: t('Toggle full screen'),
        },
      ],
    },
    {
      label: t('Window'),
      submenu: [
        {
          role: 'minimize',
          label: t('Minimize'),
        },
      ],
    },
    {
      label: t('Help'),
      submenu: [
        {
          label: t('Lisk Website'),
          click() {
            electron.shell.openExternal('https://lisk.io');
          },
        },
        {
          label: t('Lisk Chat'),
          click() {
            electron.shell.openExternal('https://lisk.chat');
          },
        },
        {
          label: t('Lisk Explorer'),
          click() {
            electron.shell.openExternal('https://explorer.lisk.io');
          },
        },
        {
          label: t('Lisk Forum'),
          click() {
            electron.shell.openExternal('https://forum.lisk.io');
          },
        },
        {
          type: 'separator',
        },
        {
          label: t('Report Issue...'),
          click() {
            electron.shell.openExternal('https://lisk.zendesk.com/hc/en-us/requests/new');
          },
        },
        {
          label: t('What\'s New...'),
          click() {
            electron.shell.openExternal('https://github.com/LiskHQ/lisk-nano/releases');
          },
        },
      ],
    },
  ];

module.exports = (app, copyright, t) => {
  const template = buildTemplate(t);
  if (process.platform === 'darwin') {
    const name = app.getName();
    template.unshift({
      label: name,
      submenu: [
        {
          role: 'about',
          label: t('About'),
        },
        {
          role: 'quit',
          label: t('Quit'),
        },
      ],
    });
  } else {
    template[template.length - 1].submenu.push({
      label: t('About'),
      click(item, focusedWindow) {
        if (focusedWindow) {
          const options = {
            buttons: ['OK'],
            icon: `${__dirname}/assets/lisk.png`,
            message: `${t('Lisk Nano\nVersion')} ${app.getVersion()}\n${copyright}`,
          };
          electron.dialog.showMessageBox(focusedWindow, options, () => {});
        }
      },
    });
  }
  return Menu.buildFromTemplate(template);
};
