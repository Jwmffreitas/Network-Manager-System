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

module.exports = {
    createUser
}