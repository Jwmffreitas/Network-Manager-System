const {app, BrowserWindow, ipcMain} = require('electron')
const path = require('path');
const { encrypt } = require('./modules/crypto');
const { createUser, verifyUser, deleteUser } = require('./modules/user');
let isFirstTime = true
let mainWindow

require('electron-reload')(__dirname, {
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
  mainWindow = new BrowserWindow({
    width: 900,
    height: 700,
    frame : false,
    movable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  if (isFirstTime) {
    mainWindow.loadFile('index.html')
  }else {
    mainWindow.loadFile('login.html')
  }
}


app.whenReady().then(async () => {
  await connectDB()
  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

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

ipcMain.on("delete", async (e) => {
  data = await deleteUser()
  if(data.includes("200")) {
    app.exit();
  }
})

ipcMain.on("close", async (e) => {
  app.exit();
})
