const { encrypt } = require('./crypto');
const User = require('./model/user');

const createUser = async (user_data) => {
    const {identifier, password } = user_data;

    let data = {};

    console.log(user_data)

    let user = await User.findOne({where: {identifier: identifier}})
    if(!user) {
        data = {identifier, password}
        user = await User.create(data)
        return `200 - ${JSON.stringify(user)}`

    }else {
       return `409 - Falha ao criar usuário. Usuário já existe!`
    }
}

const verifyUser = async (user_data) => {
    const {identifier, password } = user_data;

    let user = await User.findOne({where: {identifier: identifier}})

    console.log("verify", user.dataValues.password)

    if(user.dataValues.password == password) {
        console.log('É igual maninho')
        return `200`
    }else {
        return `403 - Erro ao verificar as credenciais`
    }
}

const deleteUser = async () => {
    const user = await User.findAll();
    console.log('baby' ,JSON.stringify(user))
    User.destroy({where: {id: user[0].id}})
    return `200`
}

module.exports = {
    createUser, verifyUser, deleteUser
}