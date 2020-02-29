const electron = require('electron');
const { app, BrowserWindow } = electron;
const path = require('path');
const url = require('url');

let mainWindow;

// TODO add an icon
app.on('ready', () => {
  let mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    title: 'Forex Pearson Tool',
    backgroundColor: '#ebebeb',
    webPreferences: {
      nodeIntegration: false
    }
  });

  const startUrl = url.format({
    pathname: path.join(__dirname, '../static/index.html'),
    protocol: 'file:',
    slashes: true
  });

  mainWindow.loadURL(startUrl);
  // mainWindow.webContents.openDevTools();

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
});

app.on('window-all-closed', function () {
  app.quit();
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});
