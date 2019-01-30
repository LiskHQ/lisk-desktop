import { Application } from 'spectron';
import path from 'path';
import ss from '../constants/selectors';

const baseDir = path.join(__dirname, '../..');
const electronBinary = path.join(baseDir, 'dist', 'mac', 'Lisk Hub.app', 'Contents', 'MacOS', 'Lisk Hub');

describe('Electron App', () => {
  const app = new Application({
    path: electronBinary,
    args: [baseDir],
  });

  beforeEach(() => app.start());

  afterEach(() => app.stop());

  it('Shows an initial window', async () => {
    const title = await app.client.waitUntilWindowLoaded().getTitle();
    expect(title).toBe('Lisk Hub');
    const count = await app.client.getWindowCount();
    expect(count).toBe(1);
    const headerText = await app.client.getText('h1');
    expect(headerText).toContain('Welcome to the Lisk Hub!');
  });

  it.skip('Download pdf', async () => {
    await app.client.waitUntilWindowLoaded();
    await app.client.click(ss.createLiskIdBtn);
    await app.client.click(ss.chooseAvatar);
    await app.client.click(ss.getPassphraseButton);
    await app.client.click(ss.downloadPdfBtn);
    await app.client.pause(5000);
  });

  xit('Hardware wallet', async () => {
    await app.electron.ipcMain('blablabla'); // Mock hw wallet conenction
    /*
      Test
     */
  });
});
