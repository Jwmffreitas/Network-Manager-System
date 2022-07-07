const { ipcRenderer } = require('electron');

const deleteUser = () => {
    ipcRenderer.sendSync("delete")
}

const exit = () => {
    ipcRenderer.sendSync("close")
}

module.exports = {
    deleteUser, exit
}