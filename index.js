const { app, BrowserWindow } = require("electron");

function createWindow()
{
    const mainWindow = new BrowserWindow({
        width: 600,
        height: 750,
        maxWidth: 800,
        maxHeight: 850,
        minHeight: 700,
        minWidth: 500,
        icon: "./images/logo.ico",
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
            devTools: false
        }
    });

    mainWindow.removeMenu();

    mainWindow.loadFile("index.html");
}

app.whenReady().then(() => {
    createWindow();

    app.on("activate", () => {
        if(BrowserWindow.getAllWindows().length === 0 ) createWindow();
    });
});

app.on("window-all-closed", () => {
    if(process.platform !== "darwin") app.quit();
});