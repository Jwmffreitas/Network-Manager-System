const { ipcRenderer } = require('electron');

const getUserData = (isFirstTime) => {
    let id = document.querySelector("#identificador").value
    let passwd = document.querySelector("#senha").value

    let user = {
        identifier: id,
        password: passwd
    }

    if(isFirstTime) {
        createUser(user)
    }else {
        login(user)
    }
}

const createUser = (user) => {
    let data = ipcRenderer.sendSync("signup", user)

    if(data.includes("409")) {
        alert(data)
    }
}

const login = (user) => {
    let data = ipcRenderer.sendSync("login", user)
    console.log(data)

    if(data.includes("403")) {
        alert(data)
    }
}

module.exports = {
    getUserData
}