import electron from 'electron'; // eslint-disable-line import/no-extraneous-dependencies

const { Menu } = electron;

const template = [
  {
    label: 'Edit',
    submenu: [
      {
        role: 'undo',
      },
      {
        role: 'redo',
      },
      {
        type: 'separator',
      },
      {
        role: 'cut',
      },
      {
        role: 'copy',
      },
      {
        role: 'paste',
      },
      {
        role: 'selectall',
      },
    ],
  },
  {
    label: 'View',
    submenu: [
      {
        role: 'reload',
      },
      {
        role: 'togglefullscreen',
      },
    ],
  },
  {
    label: 'Window',
    submenu: [
      {
        role: 'minimize',
      },
    ],
  },
  {
    label: 'Help',
    submenu: [
      {
        label: 'Lisk Website',
        click() {
          electron.shell.openExternal('https://lisk.io');
        },
      },
      {
        label: 'Lisk Chat',
        click() {
          electron.shell.openExternal('https://lisk.chat');
        },
      },
      {
        label: 'Lisk Explorer',
        click() {
          electron.shell.openExternal('https://explorer.lisk.io');
        },
      },
      {
        label: 'Lisk Forum',
        click() {
          electron.shell.openExternal('https://forum.lisk.io');
        },
      },
      {
        type: 'separator',
      },
      {
        label: 'Report Issue...',
        click() {
          electron.shell.openExternal('https://lisk.zendesk.com/hc/en-us/requests/new');
        },
      },
      {
        label: 'What\'s New...',
        click() {
          electron.shell.openExternal('https://github.com/LiskHQ/lisk-nano/releases');
        },
      },
    ],
  },
];

export default (app, copyright) => {
  if (process.platform === 'darwin') {
    const name = app.getName();
    template.unshift({
      label: name,
      submenu: [
        {
          role: 'about',
          label: 'About',
        },
        {
          role: 'quit',
          label: 'Quit',
        },
      ],
    });
  } else {
    template[template.length - 1].submenu.push({
      label: 'About',
      click(item, focusedWindow) {
        if (focusedWindow) {
          const options = {
            buttons: ['OK'],
            icon: `${__dirname}/assets/lisk.png`,
            message: `Lisk Nano\nVersion ${app.getVersion()}\n${copyright}`,
          };
          electron.dialog.showMessageBox(focusedWindow, options, () => {});
        }
      },
    });
  }
  return Menu.buildFromTemplate(template);
};
