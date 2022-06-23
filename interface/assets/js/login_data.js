const { ipcRenderer } = require('electron');

const getUserData = () => {
    let id = document.querySelector("#identificador").value
    let passwd = document.querySelector("#senha").value

    let user = {
        id: id,
        password: passwd
    }

    sendData(user)
}

const sendData = (user) => {
    console.log(ipcRenderer.sendSync("signup", user))
}

module.exports = {
    getUserData
}