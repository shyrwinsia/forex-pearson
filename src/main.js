// Basic init
const electron = require('electron');
const { app, BrowserWindow } = electron;
const path = require('path');
const url = require('url');

// To avoid being garbage collected
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

  // mainWindow.setMenu(null);
  const startUrl = url.format({
    pathname: path.join(__dirname, './static/index.html'),
    protocol: 'file:',
    slashes: true
  });

  mainWindow.loadURL(startUrl);
  // mainWindow.webContents.openDevTools();

  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
});

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  app.quit();
});

app.on('activate', function() {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});
