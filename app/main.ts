import path from 'path';
import { app, BrowserWindow } from 'electron';
import installExtension, {
  REDUX_DEVTOOLS,
  REACT_DEVELOPER_TOOLS
} from 'electron-devtools-installer';
import electronDebug from 'electron-debug';
import { isProd, isDev } from './utils';

let mainWindow: BrowserWindow | null = null;

(async () => {
  if (isProd()) {
    require('source-map-support').install();
  }

  if (isDev() || process.env.DEBUG_PROD === 'true') {
    electronDebug();
  }

  await app.whenReady();

  if (isDev() || process.env.DEBUG_PROD === 'true') {
    await installExtension(
      [REDUX_DEVTOOLS, REACT_DEVELOPER_TOOLS],
      !!process.env.UPGRADE_EXTENSIONS
    );
  }

  await createMainWindow();

  app.on('window-all-closed', () => {
    // Respect the OSX convention of having the application in memory even
    // after all windows have been closed.
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', async () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      await createMainWindow();
    }
  });
})().catch(err => {
  console.error(err);
});

async function createMainWindow() {
  mainWindow = new BrowserWindow({
    show: false,
    width: 600,
    height: 728,
    webPreferences: isDev()
      ? {
          nodeIntegration: true
        }
      : {
          preload: path.join(__dirname, 'dist/renderer.prod.js')
        }
  });

  await mainWindow.loadURL(`file://${__dirname}/app.html`);

  mainWindow.once('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('The `mainWindow` is not defined');
    }

    mainWindow.show();
    mainWindow.focus();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}
