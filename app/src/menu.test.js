import { expect } from 'chai'; // eslint-disable-line import/no-extraneous-dependencies
import { spy, match, useFakeTimers } from 'sinon'; // eslint-disable-line import/no-extraneous-dependencies
import menu from './menu';

describe('MenuBuilder', () => {
  let electron;
  let clock;

  beforeEach(() => {
    electron = {
      shell: { openExternal: spy() },
      Menu: {
        setApplicationMenu: spy(),
        buildFromTemplate: template => (template),
      },
      app: { getName: () => ('Lisk Hub'), getVersion: () => ('0.2.0') },
      dialog: { showMessageBox: spy() },
    };
    clock = useFakeTimers({
      now: new Date(2018, 1, 1),
      toFake: ['setTimeout', 'clearTimeout', 'Date'],
    });
  });

  afterEach(() => {
    clock.restore();
  });

  it('Builds the electron about menu when os is mac', () => {
    process.platform = 'darwin';
    const template = menu.build(electron);
    expect(template[0].label).to.equal('Lisk Hub');
    expect(template[0].submenu[0].role).to.equal('about');
    expect(template[0].submenu[0].label).to.equal('About');
    expect(template[0].submenu[1].role).to.equal('quit');
    expect(template[0].submenu[1].label).to.equal('Quit');

    // make sure the non-mac about menu was not added
    const submenu = template[template.length - 1].submenu;
    expect(submenu[submenu.length - 1].label).to.not.equal('About');
  });

  it('Builds the electron about menu when os is not mac', () => {
    process.platform = 'not darwin';
    const template = menu.build(electron);
    const submenu = template[template.length - 1].submenu;
    expect(submenu[submenu.length - 1].label).to.equal('About');

    // make sure the mac about menu was not added
    expect(template[0].label).to.not.equal('Lisk Hub');

    // make sure message box is not shown on click if window is not focused
    submenu[submenu.length - 1].click(null, false);
    expect(electron.dialog.showMessageBox).to.have.not.been.calledWith();

    const expectedOptions = {
      buttons: ['OK'],
      icon: '//assets/images/LISK.png',
      message: `${electron.app.getName()}\nVersion ${electron.app.getVersion()}\nCopyright © 2016 - 2018 Lisk Foundation`,
    };

    // make sure message box is shown on click if window is focused
    submenu[submenu.length - 1].click(null, true);
    expect(electron.dialog.showMessageBox).to.have.been.calledWith(
      true,
      expectedOptions,
      match.typeOf('function'),
    );
  });

  it('Should open link on click', () => {
    menu.onClickLink(electron, 'https://lisk.io');
    expect(electron.shell.openExternal).to.have.been.calledWith('https://lisk.io');
  });
});
