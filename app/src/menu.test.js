import { expect } from 'chai'; // eslint-disable-line import/no-extraneous-dependencies
import { spy } from 'sinon'; // eslint-disable-line import/no-extraneous-dependencies
import menu from './menu';

describe('MenuBuilder', () => {
  let electron;

  beforeEach(() => {
    electron = {
      shell: { openExternal: spy() },
      Menu: {
        setApplicationMenu: spy(),
        buildFromTemplate: template => (template),
      },
      app: { getName: () => ('Lisk Nano'), getVersion: () => ('some version') },
    };
  });

  it('Builds the electron about menu when os is mac', () => {
    process.platform = 'darwin';
    const template = menu.build(electron);
    expect(template[0].label).to.equal('Lisk Nano');
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
    expect(template[0].label).to.not.equal('Lisk Nano');
  });

  it('Should open link on click', () => {
    menu.onClickLink(electron, 'https://lisk.io');
    expect(electron.shell.openExternal).to.have.been.calledWith('https://lisk.io');
  });
});
