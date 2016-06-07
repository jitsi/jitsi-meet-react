var Electron = require('electron');
var App = Electron.app;
var BrowserWindow = Electron.BrowserWindow;


var mainWindow = null;;


function createWindow() {
    mainWindow = new BrowserWindow({
        title: 'Jitsi Meet App',
        icon: 'file://' + __dirname + '/favicon.ico'
    });

    mainWindow.loadURL('file://' + __dirname + '/index.html');

    mainWindow.on('closed', function () {
        mainWindow = null;
    });
}


App.on('ready', createWindow);

App.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        App.quit();
    }
});

App.on('activate', function () {
    if (mainWindow === null) {
        createWindow();
    }
});

