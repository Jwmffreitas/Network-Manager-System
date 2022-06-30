// Modules to control application life and create native browser window
const {app, BrowserWindow, ipcMain} = require('electron')
const path = require('path');
const { encrypt } = require('./modules/crypto');
const { createUser, verifyUser } = require('./modules/user');
let isFirstTime = true
let mainWindow

// Enable live reload for Electron too
require('electron-reload')(__dirname, {
    // Note that the path to electron may vary according to the main file
    electron: require(`${__dirname}/node_modules/electron`)
});

async function connectDB () {
  const database = require('./modules/db');
  const User = require('./modules/model/user');

  try {
      const resultado = await database.sync();
      console.log(resultado);
  } catch (error) {
      console.log(error);
  }

  const user = await User.findAll();
  console.log(user.length)
  if (user.length != 0 ) {
    isFirstTime = false
  } else {
    isFirstTime = true
  }
}

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 900,
    height: 700,
    frame : true,
    movable: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  if (isFirstTime) {
    mainWindow.loadFile('index.html')
  }else {
    //mainWindow.loadFile('login.html')
    mainWindow.loadFile('login.html')
  }
  // and load the index.html of the app.

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
  await connectDB()
  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

ipcMain.on("signup", async (e, user_data) => {
  console.log("signup", JSON.stringify(user_data));
  let data = user_data

  let pass_encrypted = encrypt(data.password);
  data = {identifier: user_data.identifier, password: pass_encrypted}

  data = await createUser(data)
  console.log("data", data)

  e.returnValue = JSON.stringify(data)

  app.relaunch();
  app.exit();
})

ipcMain.on("login", async (e, user_data) => {
  console.log("login", JSON.stringify(user_data));
  let data = user_data

  let pass_encrypted = encrypt(data.password);
  data = {identifier: user_data.identifier, password: pass_encrypted}

  data = await verifyUser(data)
  if(data.includes("200")) {
    e.returnValue = JSON.stringify(data)
    mainWindow.loadFile('dash.html')
    mainWindow.show()
  }else {
    e.returnValue = JSON.stringify(data)
  }
})
