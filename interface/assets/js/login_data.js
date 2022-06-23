const { ipcRenderer } = require('electron');

const getUserData = () => {
    let id = document.querySelector("#identificador").value
    let passwd = document.querySelector("#senha").value

    let user = {
        identifier: id,
        password: passwd
    }

    sendData(user)
}

const sendData = (user) => {
    let data = ipcRenderer.sendSync("signup", user)
    console.log(data)

    if(data.includes("409")) {
        alert(data)
    }
}

module.exports = {
    getUserData
}